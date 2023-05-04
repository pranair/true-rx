import redis
import json
from redis.commands.json.path import Path
import redis.commands.search.aggregation as aggregations
import redis.commands.search.reducers as reducers
from redis.commands.search.field import TextField, NumericField, TagField
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import NumericFilter, Query

file = open("medicine.json")
data = json.load(file)
file.close()
# data = data["json"]

r = redis.Redis(host='localhost', port=6379)

schema = (
    NumericField("$.id", as_name="id"), 
    TextField("$.otc", as_name="otc"), 
    TextField("$.brand_name", as_name="brand"),
    TagField("$.generic_name", as_name="generic")
)

rs = r.ft("idx:medicine")
rs.create_index(
    schema,
    definition=IndexDefinition(
        prefix=["medicine:"], index_type=IndexType.JSON
    )
)

for idx, i in enumerate(data):
	r.json().set("medicine:"+str(idx), Path.root_path(), i)
