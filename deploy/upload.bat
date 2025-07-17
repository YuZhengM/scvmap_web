@echo off
start cmd /c "scp -r D:\project\scvdb_web\dist\* ${username}@${IP}:${project_path}/data/code/web"
