import { configs as intelValorantConfigs } from './intel/valorant.js';
import { configs as intelCsgoConfigs } from './intel/csgo.js';
import { configs as intelPubgConfigs } from './intel/pubg.js';
import { configs as intelLolConfigs } from './intel/lol.js';
import { configs as intelGtaVConfigs } from './intel/gta-v.js';
import { configs as intelEldenRingConfigs } from './intel/elden-ring.js';
import { configs as intelNarakaConfigs } from './intel/naraka.js';
import { configs as intelGenshinConfigs } from './intel/genshin.js';
import { configs as intelFo4Configs } from './intel/fo4.js';
import { configs as intelBlackMythWukongConfigs } from './intel/black-myth-wukong.js';
// Import các cấu hình Intel cho các game khác

import { configs as amdValorantConfigs } from './amd/valorant.js';
import { configs as amdCsgoConfigs } from './amd/csgo.js';
import { configs as amdPubgConfigs } from './amd/pubg.js';
import { configs as amdLolConfigs } from './amd/lol.js';
import { configs as amdGtaVConfigs } from './amd/gta-v.js';
import { configs as amdEldenRingConfigs } from './amd/elden-ring.js';
import { configs as amdNarakaConfigs } from './amd/naraka.js';
import { configs as amdGenshinConfigs } from './amd/genshin.js';
import { configs as amdFo4Configs } from './amd/fo4.js';
import { configs as amdBlackMythWukongConfigs } from './amd/black-myth-wukong.js';
// Import các cấu hình AMD cho các game khác

// Định nghĩa các cấu hình cho từng loại CPU và từng game
const intelConfigs = {
    'valorant': intelValorantConfigs,
    'csgo': intelCsgoConfigs,
    'pubg': intelPubgConfigs,
    'lol': intelLolConfigs,
    'gta-v': intelGtaVConfigs,
    'elden-ring': intelEldenRingConfigs,
    'naraka': intelNarakaConfigs,
    'genshin': intelGenshinConfigs,
    'fo4': intelFo4Configs,
    'black-myth-wukong': intelBlackMythWukongConfigs,
    'god-of-war': {}  // Sẽ được bổ sung sau
};

const amdConfigs = {
    'valorant': amdValorantConfigs,
    'csgo': amdCsgoConfigs,
    'pubg': amdPubgConfigs,
    'lol': amdLolConfigs,
    'gta-v': amdGtaVConfigs,
    'elden-ring': amdEldenRingConfigs,
    'naraka': amdNarakaConfigs,
    'genshin': amdGenshinConfigs,
    'fo4': amdFo4Configs,
    'black-myth-wukong': amdBlackMythWukongConfigs,
    'god-of-war': {}  // Sẽ được bổ sung sau
};

// Hàm trợ giúp để lấy cấu hình dựa trên CPU, Game và Budget
export function getConfig(cpuType, game, budgetMillions) {
    console.log(`Getting config for: CPU Type=${cpuType}, Game=${game}, Budget=${budgetMillions}M`);
    
    // Validate inputs
    if (!cpuType || !game || !budgetMillions) {
        console.error('Missing parameters in getConfig:', { cpuType, game, budgetMillions });
        return null;
    }
    
    // Format budget key - ensure it's a whole number followed by 'M'
    budgetMillions = Math.floor(budgetMillions); // Round down to whole number
    const budgetKey = `${budgetMillions}M`;
    console.log(`Looking for budget key: "${budgetKey}" (exact format)`);
    
    // Get configuration
    let config = null;
    
    if (cpuType === 'Intel') {
        if (!intelConfigs[game]) {
            console.error(`No Intel configurations found for game: ${game}`);
            console.log('Available Intel games:', Object.keys(intelConfigs));
            return null;
        }
        
        if (!intelConfigs[game][budgetKey]) {
            console.error(`No Intel configuration found for game ${game} at budget ${budgetKey}`);
            console.log('Available budgets for this game:', Object.keys(intelConfigs[game]));
            return null;
        }
        
        // Create a new object with the configuration
        config = { ...intelConfigs[game][budgetKey] };
        console.log(`Found Intel config for ${game} at ${budgetKey}:`, config);
        
        // Add optional components if they're not included in the config
        // These are optional and might not always be needed
        if (!config.hdd) config.hdd = null;
        if (!config.monitor) config.monitor = null;
        
        return config;
    } else if (cpuType === 'Amd') {
        if (!amdConfigs[game]) {
            console.error(`No AMD configurations found for game: ${game}`);
            console.log('Available AMD games:', Object.keys(amdConfigs));
            return null;
        }
        
        if (!amdConfigs[game][budgetKey]) {
            console.error(`No AMD configuration found for game ${game} at budget ${budgetKey}`);
            console.log('Available budgets for this game:', Object.keys(amdConfigs[game]));
            return null;
        }
        
        // Create a new object with the configuration
        config = { ...amdConfigs[game][budgetKey] };
        console.log(`Found AMD config for ${game} at ${budgetKey}:`, config);
        
        // Add optional components if they're not included in the config
        // These are optional and might not always be needed
        if (!config.hdd) config.hdd = null;
        if (!config.monitor) config.monitor = null;
        
        return config;
    }
    
    // Trả về null nếu không tìm thấy cấu hình phù hợp
    console.error(`No configuration found for CPU type: ${cpuType}`);
    return null;
}

// Export tất cả các cấu hình để có thể truy cập trực tiếp
export {
    intelConfigs,
    amdConfigs
};