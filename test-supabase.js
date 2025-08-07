import supabase from './src/utils/supabase.js';

async function testSupabase() {
    console.log('Testing Supabase connection...');
    
    try {
        // Test a simple query to see if we can connect
        const { data, error } = await supabase
            .from('builder_item')
            .select('id, name')
            .limit(5);
            
        if (error) {
            console.error('Supabase error:', error);
            return;
        }
        
        console.log('Success! Found items:', data);
    } catch (error) {
        console.error('Error connecting to Supabase:', error);
    }
}

testSupabase();