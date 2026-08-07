import 'dotenv/config'
import { initDatabase } from '@/infrastructure/database/sequelize'
import app from '@/main/app'

const port = process.env.PORT || 3000

await initDatabase()

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})
