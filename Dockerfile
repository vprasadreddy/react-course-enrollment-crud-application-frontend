FROM node:alpine AS BUILD
WORKDIR /app
COPY package.json /app/package.json
RUN npm i
COPY . /app
#EXPOSE 3000
RUN npm run build
#CMD ["npm", "start"]

# production environment
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=BUILD /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
