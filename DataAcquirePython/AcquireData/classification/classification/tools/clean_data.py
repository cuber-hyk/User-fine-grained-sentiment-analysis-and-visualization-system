import os
import pandas as pd
from pathlib import Path
def get_file_line_count(file_path):
    """获取文件的总行数"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return len(f.readlines())
    except Exception as e:
        print(f"读取文件行数失败: {file_path}, 错误: {e}")
        return 0

def clean_csv_files(directory):
    """
    清理指定目录下的所有CSV文件：
    1. 移除 Aspect/Opinion/Sentiment 列中存在空值的行
    2. 保留原始文件结构（列顺序和编码）
    3. 生成带 _cleaned 后缀的新文件

    参数:
        directory (str): 待处理的目录路径
    """

    for filename in os.listdir(directory):
        if filename.endswith('.csv'):
            file_path = os.path.join(directory, filename)


            # 读取CSV文件
            try:
                df = pd.read_csv(file_path, encoding='utf-8')
            except Exception as e:
                print(f"读取文件 {file_path} 失败: {e}")
                continue

            # 筛选有效行（后三列均不为空）
            cleaned_df = df.dropna(subset=['Aspect', 'Opinion', 'Sentiment'])
            output_directory = Path(__file__).parent.parent / 'data' / 'triplets_cleaned'
            # 生成新文件名
            new_filename = f"{filename[:-4]}_cleaned.csv"
            new_file_path = os.path.join(directory, new_filename)

            # 保存清洗后的数据
            cleaned_df.to_csv(new_file_path, index=False, encoding='utf-8')
            print(f"已清理 {file_path} → {new_file_path}")


if __name__ == "__main__":
    # 使用示例：替换为你的目标目录路径
    target_directory = Path(__file__).parent.parent / 'data' / 'triplets'

    clean_csv_files(target_directory)
