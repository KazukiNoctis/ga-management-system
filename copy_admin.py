import os
import shutil

src = r"c:\laragon\www\ga-management-system\src\app\(admin)"
dst = r"c:\laragon\www\ga-management-system\src\app\admin"

if not os.path.exists(dst):
    os.makedirs(dst)

for root, dirs, files in os.walk(src):
    for dir_name in dirs:
        dir_path = os.path.join(root, dir_name)
        new_dir = dir_path.replace(src, dst)
        if not os.path.exists(new_dir):
            os.makedirs(new_dir)
            
    for file_name in files:
        src_file = os.path.join(root, file_name)
        dst_file = src_file.replace(src, dst)
        shutil.copy2(src_file, dst_file)
