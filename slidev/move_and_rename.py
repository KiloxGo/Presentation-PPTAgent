import os
import re
import shutil

base_dir = os.path.dirname(os.path.abspath(__file__))

# 匹配 slide_n-export.pptx
pattern = re.compile(r'slide_(\d+)-export\.pptx', re.IGNORECASE)

found = False

for filename in os.listdir(base_dir):
    match = pattern.search(filename)
    if match:
        page_num = match.group(1)
        target_folder = os.path.join(base_dir, page_num)
        # 移动pptx并以页码命名
        pptx_src = os.path.join(base_dir, filename)
        pptx_dst = os.path.join(target_folder, f"{page_num}.pptx")
        os.makedirs(target_folder, exist_ok=True)
        shutil.move(pptx_src, pptx_dst)
        # 如果有图片1.png，重命名为n.png
        png_src = os.path.join(target_folder, "1.png")
        png_dst = os.path.join(target_folder, f"{page_num}.png")
        if os.path.exists(png_src):
            os.rename(png_src, png_dst)
        found = True

if not found:
    print("未发现任何符合规则的文件！")
else:
    print("全部处理完成！")



