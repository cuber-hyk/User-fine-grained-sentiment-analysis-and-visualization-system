import json

# 读取 JSON 文件
input_file = 'input.json'
output_file = 'output.json'

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 过滤掉 pid 为空的对象
filtered_data = [item for item in data if item.get('pid')]

# 将过滤后的数据写回文件
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(filtered_data, f, ensure_ascii=False, indent=2)

print(f"Filtered data has been written to {output_file}")