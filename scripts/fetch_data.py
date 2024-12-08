import os
import sys
import json
import time

def get_json(item):
    item_info = item.split("$%")
    index = item_info[0]
    name = item_info[1]
    desc = item_info[2]
    create_time = item_info[3]
    isPass = int(item_info[4])
    canShow = int(item_info[5])
    isFinish = int(item_info[6])
    link = item_info[7]
    last_update_time = item_info[8]
    item_json = {
        "index": index,
        "name": name,
        "desc": desc,
        "create_time": create_time,
        "isPass": isPass,
        "canShow": canShow,
        "isFinish": isFinish,
        "link": link,
        "last_update_time": last_update_time
    }
    return item_json
def main():
    try:
        payload = json.load(sys.stdin)
        # 确保 users 是列表格式
        data = str(payload.get("data"))
        data_info = data[1:-1].split(",")
        path_now = os.path.dirname(os.path.abspath(__file__))
        for item in data_info:
            item_json = get_json(item)
            file_path = os.path.join(path_now, "data", f"{item_json['index']}.json")
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(item_json, f, ensure_ascii=False, indent=4)
        # 遍历data 文件夹下的json，写入到datalist.json中
        data_dir = os.path.join(path_now, "data")
        json_files = [f for f in os.listdir(data_dir) if f.endswith('.json')]
        with open(os.path.join(path_now, "datalist.json"), 'w', encoding='utf-8') as f:
            json.dump(json_files, f, ensure_ascii=False, indent=4)

    except json.JSONDecodeError:
        print("Failed to decode JSON.")
    except Exception as e:
        print(f"An error occurred: {e}")
    # 遍历data目录下的所有json文件，写入到datalist.json中
    # script_dir = os.path.dirname(os.path.abspath(__file__))
    # json_files = [f for f in os.listdir(data_dir) if f.endswith('.json')]
    # datalist_path = os.path.join(script_dir, 'datalist.json')
    # with open(datalist_path, 'w', encoding='utf-8') as f:
    #     json.dump(json_files, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
