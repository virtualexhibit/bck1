1. Why Delete & Clear All Are NOT Working

Your Vue code only deletes tasks locally in the UI, but does NOT call the backend DELETE API.

Example:

clearAll() {
  const confirm = window.confirm(`Are you sure you want to clear all tasks?`)
  if (confirm) {
    this.tasks = []
  }
}


This only clears the array. The backend still contains tasks—so when fetchAddedTask() runs, the tasks come back.

Same problem with deleting a single task.

We must:

✔ Call /api/tasks/?id=X for deleting a task
✔ Call /api/tasks/ without id for deleting ALL tasks (your Flask delete API already supports this!)
✅ 2. Fix Your Vue Methods
► A. Delete a single task

Add this method inside methods:

async deleteTask(taskId) {
  const confirmDelete = window.confirm("Delete this task?")
  if (!confirmDelete) return

  try {
    await this.apiCallerInstance.delete('TASKS', { id: taskId })

    // update frontend list
    this.tasks = this.tasks.filter(t => t.id !== taskId)
  } catch (error) {
    console.error("Delete failed:", error)
    alert("Failed to delete task.")
  }
}

🔥 IMPORTANT

Make sure your ApiCaller .delete() function supports query params:

delete(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return fetch(`${this.baseUrl}/${endpoint}?${queryString}`, {
    method: "DELETE",
  }).then(res => res.json());
}

► B. Fix clearAll()

Call the backend DELETE with no id.

Replace your method with:

async clearAll() {
  const confirmClear = window.confirm("Are you sure you want to clear all tasks?")
  if (!confirmClear) return

  try {
    await this.apiCallerInstance.delete('TASKS')   // no params → delete ALL tasks
    this.tasks = []
  } catch (error) {
    console.error("Clear all failed:", error)
    alert("Failed to clear tasks.")
  }
}

✅ 3. Make sure your Flask delete route can handle clear-all

You already have:

task_id = request.args.get("id")

if task_id is not None:
    ...
else:
    # delete all tasks


But this part is missing! You must add the “delete all” logic:

✔ Add this inside your DELETE route:
if task_id is None:
    TASK_MANAGER._tasks = []
    return jsonify({"message": "All tasks cleared"}), 200


Final version:

@tasks_api.route("/", methods=["DELETE"])
def delete_task():
    task_id = request.args.get("id")

    # Clear ALL tasks
    if task_id is None:
        TASK_MANAGER._tasks = []
        return jsonify({"message": "All tasks cleared"}), 200

    # Delete ONE task
    try:
        task_id = int(task_id)
    except ValueError:
        return jsonify({"error": "Invalid task id"}), 400

    success = TASK_MANAGER.delete_task(task_id)
    if not success:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({"message": "Task deleted"}), 200

✅ 4. How you call delete from components

Example inside <MinimalistTask>:

<button @click="$emit('delete-task', task.id)">❌</button>


Parent:

<MinimalistTask
  v-for="task in tasks"
  :key="task.id"
  :task="task"
  @delete-task="deleteTask"
/>

🎉 Done — Now Delete & Clear-All Fully Work
After applying the fixes:

✔ Add task → works
✔ Delete task → removes from backend + frontend
✔ Clear all → wipes backend + frontend
✔ Refresh page → tasks stay deleted