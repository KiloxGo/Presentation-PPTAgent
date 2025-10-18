import subprocess
import time
import re
import platform
import threading
from queue import Queue, Empty
import schedule
import asyncio
from pyppeteer import launch
import argparse
import sys
import socket
import json

def remove_ansi_escape_codes(text):
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text)

def is_port_in_use(port):
    """检查指定端口是否被占用"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def find_available_port(start_port):
    """找到一个可用的端口"""
    port = start_port
    while is_port_in_use(port):
        print(f"端口 {port} 已被占用，尝试下一个端口...")
        port += 1
        if port > start_port + 10:  # 限制尝试 10 个端口
            raise RuntimeError("无法找到可用端口")
    return port

class SlidevController:
    def __init__(self):
        self.process = None
        self.shutdown_event = threading.Event()
        self.port = 3030
        self.server_url = None
        self.current_slide = 0  # 跟踪当前幻灯片索引
        self.schedule_shutdown()

    def enqueue_output(self, process, queue):
        """从子进程捕获输出并放入队列"""
        for line in iter(process.stdout.readline, ''):
            queue.put(line)
        process.stdout.close()

    def start_slidev(self, deck_path='slides.md', port=3030):
        """启动Slidev，不自动打开浏览器"""
        self.port = find_available_port(port)
        print(f"正在启动Slidev，使用文件路径: {deck_path}，端口: {self.port}")

        command = ['npx', 'slidev', deck_path, '--port', str(self.port)]

        if platform.system() == 'Windows':
            self.process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                shell=True,
                text=True,
                bufsize=1,
                encoding='utf-8'
            )
        else:
            self.process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                encoding='utf-8'
            )

        q = Queue()
        t = threading.Thread(target=self.enqueue_output, args=(self.process, q))
        t.daemon = True
        t.start()

        server_started_pattern = re.compile(r'public slide show >\s*http://localhost:\d+/')

        try:
            server_url = None
            print("等待Slidev服务器启动...")
            while True:
                try:
                    line = q.get(timeout=1).strip()
                    print(f"Raw line: {line!r}")
                    cleaned_line = remove_ansi_escape_codes(line)
                    print(f"Cleaned line: {cleaned_line!r}")
                    match = server_started_pattern.search(cleaned_line)
                    if match:
                        server_url = re.search(r'http://localhost:\d+', cleaned_line).group(0) + '/'
                        self.server_url = server_url
                        print(f"Slidev服务器已在 {server_url} 启动")
                        break
                except Empty:
                    if self.process.poll() is not None:
                        raise RuntimeError("Slidev进程意外退出")
                except re.error as e:
                    print(f"正则表达式错误: {e}")
                    break
                except Exception as e:
                    print(f"处理错误: {e}")
                    break

            print("Slidev正在运行，凌晨12点将自动停止...")
            while not self.shutdown_event.is_set():
                print("当前时间：", time.strftime("%H:%M:%S"))
                schedule.run_pending()
                time.sleep(1)

            self.process.wait()
            print("Slidev已停止")

        except Exception as e:
            print(f"发生错误: {e}")
            if self.process and self.process.poll() is None:
                self.stop_slidev()
            raise

    def stop_slidev(self):
        print("进入 stop_slidev 方法")
        if self.process and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()

    def schedule_shutdown(self):
        """安排每天凌晨12点关闭Slidev"""
        schedule.every().day.at("00:00").do(self.shutdown_at_midnight)

    def shutdown_at_midnight(self):
        """在凌晨12点关闭Slidev"""
        print("到凌晨12点了，正在关闭Slidev...")
        self.shutdown_event.set()
        self.stop_slidev()

    async def navigate_to_slide(self, slide_index):
        if not self.server_url:
            print("Slidev 服务器未启动，无法导航")
            return None
        try:
            browser = await launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
            page = await browser.newPage()
            target_url = f'{self.server_url}?currentSlide={slide_index}#{slide_index - 1}'  # Match frontend URL
            print(f"导航到: {target_url}")
            await page.goto(target_url, {'waitUntil': 'networkidle2'})
            await page.waitForFunction(
                'document.querySelector(".slidev-slide.active")?.getAttribute("data-index") === ' + str(slide_index - 1),
                {'timeout': 15000}
            )
            await page.waitForTimeout(5000)
            current_slide = await page.evaluate('document.querySelector(".slidev-slide.active")?.getAttribute("data-index")')
            if current_slide is not None and current_slide == str(slide_index - 1):
                self.current_slide = slide_index
                print(f"导航成功，当前 slide 索引: {self.current_slide}")
            await browser.close()
            return await page.content()
        except Exception as e:
            print(f"Puppeteer 导航错误: {e}")
            await browser.close() if 'browser' in locals() else None
            return None

async def get_current_slide(self):
    if not self.server_url:
        print("Slidev 服务器未启动，无法获取当前幻灯片")
        return None
    try:
        browser = await launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        page = await browser.newPage()
        await page.goto(self.server_url, {'waitUntil': 'networkidle2'})
        await page.waitForFunction(
            'document.querySelector(".slidev-slide.active")',
            {'timeout': 25000}
        )
        await page.waitForTimeout(7000)
        current_slide = await page.evaluate('document.querySelector(".slidev-slide.active")?.getAttribute("data-index")')
        if current_slide is not None:
            self.current_slide = int(current_slide) + 1  # Convert to 1-based
        await browser.close()
        return self.current_slide
    except Exception as e:
        print(f"获取当前幻灯片错误: {e}")
        await browser.close() if 'browser' in locals() else None
        return self.current_slide if self.current_slide > 0 else 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="自动启动Slidev预览并导航到指定 slide")
    parser.add_argument("--path", default='slides.md', help="Slidev文件路径")
    parser.add_argument("--port", type=int, default=3030, help="服务器端口")
    parser.add_argument("--slide", type=int, help="导航到的 slide 索引")
    parser.add_argument("--markdown", type=str, help="要应用的 Markdown 内容")

    args = parser.parse_args()

    controller = SlidevController()
    try:
        controller.start_slidev(args.path, args.port)

        if args.slide:
            print(f"导航到 slide {args.slide}")
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            content = loop.run_until_complete(controller.navigate_to_slide(args.slide))
            if content:
                print("导航成功，内容已获取")
            else:
                print("导航失败")

        if args.markdown:
            print(f"接收到的 Markdown 内容: {args.markdown}")
            with open(args.path, 'a', encoding='utf-8') as f:
                f.write(f"\n{args.markdown}\n")

        # 保持运行以处理 webhook 请求
        loop = asyncio.get_event_loop()
        loop.run_forever()

    except KeyboardInterrupt:
        print("\n用户中断，正在关闭...")
        controller.stop_slidev()
    except Exception as e:
        print(f"发生未处理错误: {e}")
        controller.stop_slidev()
    finally:
        if controller.process and controller.process.poll() is None:
            controller.stop_slidev()