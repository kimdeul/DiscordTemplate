import { client } from "./bot";

client.login(/* 이곳에 토큰을 입력합니다. */)
    .then(() => console.log(`${client.user?.tag}에 로그인됨`))