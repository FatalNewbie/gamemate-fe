# 1단계: 빌드 단계
FROM node:latest AS build

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package.json yarn.lock ./

# 의존성 설치
# lockfile에 명시된 버전만 설치
RUN yarn install --frozen-lockfile  

# 환경 변수 설정
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ARG REACT_APP_PYTHON_API_URL
ENV REACT_APP_PYTHON_API_URL=${REACT_APP_PYTHON_API_URL}

# 애플리케이션 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN yarn build

# 2단계: Nginx로 서빙
FROM nginx:alpine

# Nginx의 기본 웹 루트에 빌드된 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 (선택 사항)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]