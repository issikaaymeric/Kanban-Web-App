const supabase = require('../config/supabase');

const ColumnModel = {
  // Get all columns with their tasks
  async getAll() {
    const { data, error } = await supabase
      .from('columns')
      .select(`
        *,
        tasks (
          id,
          title,
          content,
          position,
          created_at,
          updated_at
        )
      `)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'tasks' });

    if (error) throw error;
    return data;
  },

  // Get a single column by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('columns')
      .select(`*, tasks(*)`)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new column
  async create({ title, position = 0 }) {
    const { data, error } = await supabase
      .from('columns')
      .insert([{ title, position }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a column title
  async update(id, { title }) {
    const { data, error } = await supabase
      .from('columns')
      .update({ title })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a column (tasks will cascade delete via FK constraint)
  async delete(id) {
    const { error } = await supabase
      .from('columns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Column deleted successfully' };
  },
};

module.exports = ColumnModel;
