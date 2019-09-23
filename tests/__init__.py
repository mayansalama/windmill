import os

test_datafiles = {}
test_data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
for fname in os.listdir(test_data_dir):
    with open(os.path.join(test_data_dir, fname), "r+") as f:
        test_datafiles[fname] = f.read()
