const bedrock = require('bedrock-protocol')

const client = bedrock.createClient({
  host: process.env.MC_HOST,
  port: Number(process.env.MC_PORT),
  username: process.env.MC_NAME,
  offline: true
})

client.on('join', () => {
  console.log('✅ Joined server')
})

client.on('spawn', () => {
  console.log('🟢 Spawned in world')

  // мінімальний рух кожні 3 секунди
  setInterval(() => {
    client.queue('move_player', {
      runtime_id: client.runtimeEntityId,
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
})
