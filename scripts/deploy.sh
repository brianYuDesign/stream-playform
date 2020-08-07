aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 601861565353.dkr.ecr.ap-northeast-1.amazonaws.com/kgcm-backend
docker build -t kgcm-backend .
docker tag kgcm-backend:latest 601861565353.dkr.ecr.ap-northeast-1.amazonaws.com/kgcm-backend:latest
docker push 601861565353.dkr.ecr.ap-northeast-1.amazonaws.com/kgcm-backend:latest




