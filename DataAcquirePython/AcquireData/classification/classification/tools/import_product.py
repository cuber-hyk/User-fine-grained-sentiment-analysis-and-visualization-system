import pandas as pd
from neo4j import GraphDatabase
from pathlib import Path

# Neo4j数据库连接配置
uri = "bolt://localhost:7687"  # Neo4j服务的URI
user = "neo4j"  # 用户名
password = "Guet@120319"  # 密码


# 连接到Neo4j数据库
driver = GraphDatabase.driver(uri, auth=(user, password))


# 定义Cypher查询函数
def create_nodes(tx, data, node, node_id):
    for index, row in data.iterrows():
        # 创建节点
        query = f"MERGE (n:{node} {{{node_id}: ${node_id}}}) " \
                f"ON CREATE SET n += $properties"
        tx.run(
            query,
            **{node_id: row[node_id]},  # 动态传递 ID 属性值
            properties=row.to_dict()  # 传递所有属性
        )


def get_max_id(tx, node, node_id):
    result = tx.run(f"MATCH (n:{node}) RETURN MAX(n.{node_id}) AS max_id")
    return result.single()["max_id"] or 0


def create_products_and_aspects(tx, data, product_id):
    for index, row in data.iterrows():
        # 创建 Product 节点
        # tx.run(f"MERGE (p:Product {pid:{product_id}})")
        # 动态创建 Aspect 节点并建立关系
        tx.run(
            "MERGE (a:Aspect {name: $aspect}) "
            "WITH a "
            "MATCH (p:Product {pid: $pid}) "
            "MERGE (p)-[:HAS_ASPECT]->(a)",
            aspect=row["Aspect"], pid=product_id
        )


def create_aspects_and_opinion(tx, data, product_id):
    for index, row in data.iterrows():
        tx.run(
            "MERGE (o:Opinion {name: $opinion}) "
            "MATCH (a:Aspect {name: $aspect_name} "
            "MATCH (p:Product {pid: $pid}) "
            "MATCH (p)-[:HAS_ASPECT]->(a)"
            "MERGE (a)-[:HAS_OPINION]->(o)",
            aspect=row["Opinion"], pid=product_id, aspect_name=row["Aspect"]
        )


def create_triplets(tx, product_id, data):
    for index, row in data.iterrows():
        # 创建 Aspect 节点并建立 Product 与 Aspect 的关系
        tx.run(
            "MATCH (p:Product {pid: $product_id}) "
            "MERGE (a:Aspect {name: $aspect}) "
            "MERGE (p)-[:HAS_ASPECT]->(a)",
            product_id=product_id, aspect=row["Aspect"]
        )
        # 创建 Opinion 节点并建立 Aspect 与 Opinion 的关系
        tx.run(
            "MATCH (a:Aspect {name: $aspect}) "
            "MERGE (o:Opinion {text: $opinion, sentiment: $sentiment}) "
            "MERGE (a)-[:HAS_OPINION]->(o)",
            aspect=row["Aspect"], opinion=row["Opinion"], sentiment=row["Sentiment"]
        )


# CSV文件路径
csv_path = 'test_product.csv'
csv_dir = Path(__file__).parent.parent / 'data' / 'triplets_cleaned'
# 读取CSV文件
df = pd.read_csv(csv_path)

files = [f for f in csv_dir.iterdir() if f.is_file()]

for file in files:
    pid = file.stem.split('_')[0]
    print(pid)
    dataframe = pd.read_csv(file)
    with driver.session() as session:
        session.execute_write(create_triplets, pid, dataframe)

# 关闭驱动
driver.close()
