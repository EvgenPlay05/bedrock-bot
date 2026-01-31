const bedrock = require('bedrock-protocol')

const client = bedrock.createClient({
  host: process.env.MC_HOST,       // IP сервера
  port: Number(process.env.MC_PORT), // порт
  username: process.env.MC_NAME,   // імʼя бота
  offline: true
})

client.on('join', () => {
  console.log('✅ Joined server')
})

client.on('spawn', () => {
  console.log('🟢 Spawned in world')

  // перевірка на наявність entity
  const waitEntity = setInterval(() => {
    if (client.entity) {
      console.log('✅ Bot entity ready at', client.entity.position)

      // починаємо рухати бота кожні 3 секунди
      setInterval(() => {
        client.queue('move_player', {
          runtime_id: client.entity.runtime_id,
          position: client.entity.position,
          pitch: 0,
          yaw: client.entity.yaw,
          head_yaw: client.entity.yaw,
          mode: 0,
          on_ground: true,
          riding_runtime_id: 0,
          tick: Date.now()
        })
      }, 3000)

      clearInterval(waitEntity) // зупиняємо чекання entity
    } else {
      console.log('⏳ Bot entity not ready yet...')
    }
  }, 500) // перевіряємо кожні 0.5 секунди
})
