import pandas as pd
import os
from pathlib import Path

def split_csv_chunked(input_file, output_prefix, chunk_size=3000):
    # 初始化计数器
    file_counter = 1

    # 使用迭代器逐块读取CSV文件
    for chunk in pd.read_csv(input_file, chunksize=chunk_size):
        output_file = f"{output_prefix}_part_{file_counter}.csv"
        chunk.to_csv(output_file, index=False)
        print(f"Created file: {output_file}")
        file_counter += 1


# 使用示例
path = Path(__file__).parent.parent / 'data' / 'crawled_product_pid.csv'
output_path = Path(__file__).parent.parent / 'data' / 'crawled_product'
input_file = path  # 原始CSV文件路径
output_prefix = output_path  # 输出文件的前缀
chunk_size = 300  # 每个文件的最大行数

split_csv_chunked(input_file, output_prefix, chunk_size)