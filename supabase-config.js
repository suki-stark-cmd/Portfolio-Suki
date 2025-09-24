// Supabase Configuration and Service Layer
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

// Supabase Configuration - Replace with your actual values
const supabaseConfig = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here'
};

// Initialize Supabase client
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

class SupabaseService {
    constructor() {
        this.supabase = supabase;
        this.tables = {
            personalInfo: 'personal_info',
            projects: 'projects',
            skills: 'skills',
            experience: 'experience',
            aboutInfo: 'about_info',
            messages: 'messages'
        };
    }

    // Authentication Methods
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (error) {
            console.error('Sign in error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            
            return {
                success: true,
                user
            };
        } catch (error) {
            console.error('Get user error:', error);
            return {
                success: false,
                error: error.message,
                user: null
            };
        }
    }

    // Database Operations
    async getTable(tableName, filters = {}) {
        try {
            let query = this.supabase.from(tableName).select('*');
            
            // Apply filters if provided
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
            
            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            console.error(`Get ${tableName} error:`, error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    async getRecord(tableName, id) {
        try {
            const { data, error } = await this.supabase
                .from(tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error(`Get ${tableName} record error:`, error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    async addRecord(tableName, data) {
        try {
            // Add timestamps
            const recordData = {
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await this.supabase
                .from(tableName)
                .insert([recordData])
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                success: true,
                data: result,
                id: result.id
            };
        } catch (error) {
            console.error(`Add ${tableName} error:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateRecord(tableName, id, data) {
        try {
            // Add updated timestamp
            const updateData = {
                ...data,
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await this.supabase
                .from(tableName)
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error(`Update ${tableName} error:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteRecord(tableName, id) {
        try {
            const { error } = await this.supabase
                .from(tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error(`Delete ${tableName} error:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Specific methods for portfolio data
    async getPersonalInfo() {
        const result = await this.getTable(this.tables.personalInfo);
        return {
            success: result.success,
            data: result.data.length > 0 ? result.data[0] : null,
            error: result.error
        };
    }

    async updatePersonalInfo(data) {
        // Check if record exists
        const existing = await this.getPersonalInfo();
        
        if (existing.success && existing.data) {
            // Update existing record
            return await this.updateRecord(this.tables.personalInfo, existing.data.id, data);
        } else {
            // Create new record
            return await this.addRecord(this.tables.personalInfo, data);
        }
    }

    async getAboutInfo() {
        const result = await this.getTable(this.tables.aboutInfo);
        return {
            success: result.success,
            data: result.data.length > 0 ? result.data[0] : null,
            error: result.error
        };
    }

    async updateAboutInfo(data) {
        // Check if record exists
        const existing = await this.getAboutInfo();
        
        if (existing.success && existing.data) {
            // Update existing record
            return await this.updateRecord(this.tables.aboutInfo, existing.data.id, data);
        } else {
            // Create new record
            return await this.addRecord(this.tables.aboutInfo, data);
        }
    }

    async getProjects() {
        return await this.getTable(this.tables.projects);
    }

    async addProject(data) {
        return await this.addRecord(this.tables.projects, data);
    }

    async updateProject(id, data) {
        return await this.updateRecord(this.tables.projects, id, data);
    }

    async deleteProject(id) {
        return await this.deleteRecord(this.tables.projects, id);
    }

    async getSkills() {
        return await this.getTable(this.tables.skills);
    }

    async addSkill(data) {
        return await this.addRecord(this.tables.skills, data);
    }

    async updateSkill(id, data) {
        return await this.updateRecord(this.tables.skills, id, data);
    }

    async deleteSkill(id) {
        return await this.deleteRecord(this.tables.skills, id);
    }

    async getExperience() {
        return await this.getTable(this.tables.experience);
    }

    async addExperience(data) {
        return await this.addRecord(this.tables.experience, data);
    }

    async updateExperience(id, data) {
        return await this.updateRecord(this.tables.experience, id, data);
    }

    async deleteExperience(id) {
        return await this.deleteRecord(this.tables.experience, id);
    }

    async getMessages() {
        return await this.getTable(this.tables.messages);
    }

    async addMessage(data) {
        return await this.addRecord(this.tables.messages, data);
    }

    async updateMessage(id, data) {
        return await this.updateRecord(this.tables.messages, id, data);
    }

    async deleteMessage(id) {
        return await this.deleteRecord(this.tables.messages, id);
    }

    // Real-time subscriptions
    subscribeToTable(tableName, callback) {
        return this.supabase
            .channel(`${tableName}-changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: tableName
                },
                (payload) => {
                    callback({
                        success: true,
                        event: payload.eventType,
                        data: payload.new || payload.old,
                        table: tableName
                    });
                }
            )
            .subscribe();
    }

    // Auth state listener
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }

    // Test connection
    async testConnection() {
        try {
            const { data, error } = await this.supabase.from('projects').select('count').limit(1);
            return {
                success: !error,
                message: error ? error.message : 'Connection successful'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

// Export the service instance
export const supabaseService = new SupabaseService();
export { supabase };