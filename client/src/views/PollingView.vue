<script setup>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios';
const msg = ref('')

const base_url = import.meta.env.VITE_APP_BACK_URL
const msgs = ref([])
const name = ref('Anonymous User')
let lastMessageTime
let userColors = {}

const canSend = computed(()=>{
  return name.value.length >= 3 && msg.value.length > 0
})

const giveRandomColorPart = () => {
  return Math.random() * 180;
}

const generateColor = (text) => {
  if(!userColors[text]){
    userColors[text] = `rgb(${giveRandomColorPart()},${giveRandomColorPart()},${giveRandomColorPart()})`
  }

  return userColors[text]
}

const sendMsg = async () => {
  try{
    lastMessageTime = Date.now()

    await axios.post(`${base_url}/message`, {
      id: lastMessageTime ,
      msg: msg.value,
      user: name.value,
    })

    msg.value = ''
  } 
  catch(err){
    console.error(err)
  }
}

const startPolling = async () => {
  try{
    let {data} = await axios.get(`${base_url}/messages`)

    if (lastMessageTime == data.id && data.user == name.value){
      data['isMine'] = true
    }

    msgs.value.push(data)
    startPolling()
  } 
  catch(err){
    console.error(err)
    setTimeout(()=>{
      startPolling()
    }, 500)
  }
}

onMounted(()=>{
  startPolling()
})

</script>

<template>
  <div class="main">
    <div class="header">
      <span class="header-extra">
        <h2>Polling</h2>
        <input type="button" value="Reconnect" @click="startPolling">
      </span>
      <input type="text" v-model="name" placeholder="Your name">
    </div>
  
    <!-- all the msgs -->
    <div class="chat-window">
      <div 
        v-for="msg in msgs"
        :key="msg.id" 
        class="msg"
        :class="{'myMsg': msg.isMine}"
      >
      <div class="msg-box" :class="{'myMsgBox': msg.isMine}">
        <b 
          v-if="!msg.isMine"
          :style="`color: ${generateColor(msg.user)}`"
        >
          {{ msg.user }}
        </b>
        {{ msg.msg }}
      </div>
      </div>
    </div>
  
    <!-- send msg -->
    <div>
      <input type="text" placeholder="Enter msg" v-model="msg">
      <input type="button" value="SEND" @click="sendMsg" :disabled="!canSend">
    </div>
  </div>
</template>

<style scoped>
.main{
  width: 30rem;
  overflow-x: hidden;
}

.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-extra{
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.chat-window{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 40rem;
  overflow-x: hidden;
  border: solid 1px black;
  border-radius: 5px;
  padding: 1rem;
}

.msg{
  width: 100%;
  display: flex;
}

.myMsg{
  justify-content: right;
}

.msg-box{
  border: solid 1px gray;

  padding: 0.5rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.myMsgBox{
  text-align: right;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 5px;
}
</style>
