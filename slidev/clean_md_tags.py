import argparse
import os

def remove_specific_md_tags(input_file, output_file=None):
    """
    仅删除Markdown文件开头的```markdown和结尾的```标记
    
    参数:
        input_file: 输入的Markdown文件路径
        output_file: 输出文件路径，若为None则覆盖原文件
    """
    # 读取文件内容
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.rstrip('\n') for line in f]  # 保留换行符但不包含在字符串中
    
    # 找到开头的```markdown并移除
    start_idx = 0
    if lines and lines[0].strip() == '```markdown':
        start_idx = 1  # 跳过开头的```markdown行
    
    # 找到结尾的```并移除
    end_idx = len(lines)
    if lines and lines[-1].strip() == '```':
        end_idx = len(lines) - 1  # 不包含结尾的```行
    
    # 提取有效内容
    cleaned_lines = lines[start_idx:end_idx]
    
    # 确定输出文件
    if output_file is None:
        output_file = input_file
    
    # 写入处理后的内容
    with open(output_file, 'w', encoding='utf-8') as f:
        for line in cleaned_lines:
            f.write(line + '\n')
    
    # 计算移除的行数
    removed_start = 1 if start_idx > 0 else 0
    removed_end = 1 if end_idx < len(lines) else 0
    
    print(f"处理完成，文件已保存至: {output_file}")
    print(f"移除了开头 {removed_start} 行和结尾 {removed_end} 行的标记")

def main():
    parser = argparse.ArgumentParser(description='仅删除Markdown文件开头的```markdown和结尾的```标记')
    parser.add_argument('input_file', help='输入的Markdown文件路径')
    parser.add_argument('-o', '--output', help='输出文件路径，若不指定则覆盖原文件')
    
    args = parser.parse_args()
    
    # 检查输入文件是否存在
    if not os.path.exists(args.input_file):
        print(f"错误: 文件 '{args.input_file}' 不存在")
        return
    
    # 检查输入文件是否为.md文件
    if not args.input_file.lower().endswith('.md'):
        print(f"警告: 输入文件 '{args.input_file}' 不是Markdown文件(.md)")
        # 仍然继续处理，但给出警告
    
    # 处理文件
    remove_specific_md_tags(args.input_file, args.output)

if __name__ == "__main__":
    main()
    