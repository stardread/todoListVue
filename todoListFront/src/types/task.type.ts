export type Status = 'todo' | 'inProgress' | 'done'

export type Task = {
  _id?: string
  title?: string
  description?: string
  status?: Status
}
