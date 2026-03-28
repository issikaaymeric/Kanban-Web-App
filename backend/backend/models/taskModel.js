const supabase = require('../config/supabase');

const TaskModel = {
  // Get all tasks, optionally filtered by column
  async getAll(columnId = null) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });

    if (columnId) {
      query = query.eq('column_id', columnId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get a single task by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new task
  async create({ title, content, column_id, position = 0 }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, content, column_id, position }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a task (content, title, etc.)
  async update(id, fields) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Move a task to a different column (drag & drop)
  async move(id, column_id, position) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ column_id, position, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a task
  async delete(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Task deleted successfully' };
  },
};

module.exports = TaskModel;
