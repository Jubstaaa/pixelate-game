const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const HERO_BASE_URL = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes'

const heroes = [
    { name: 'Anti-Mage', key: 'antimage' },
    { name: 'Axe', key: 'axe' },
    { name: 'Bane', key: 'bane' },
    { name: 'Bloodseeker', key: 'bloodseeker' },
    { name: 'Crystal Maiden', key: 'crystal_maiden' },
    { name: 'Drow Ranger', key: 'drow_ranger' },
    { name: 'Earthshaker', key: 'earthshaker' },
    { name: 'Juggernaut', key: 'juggernaut' },
    { name: 'Mirana', key: 'mirana' },
    { name: 'Morphling', key: 'morphling' },
    { name: 'Shadow Fiend', key: 'nevermore' },
    { name: 'Phantom Lancer', key: 'phantom_lancer' },
    { name: 'Puck', key: 'puck' },
    { name: 'Pudge', key: 'pudge' },
    { name: 'Razor', key: 'razor' },
    { name: 'Sand King', key: 'sand_king' },
    { name: 'Storm Spirit', key: 'storm_spirit' },
    { name: 'Sven', key: 'sven' },
    { name: 'Tiny', key: 'tiny' },
    { name: 'Vengeful Spirit', key: 'vengefulspirit' },
    { name: 'Windranger', key: 'windranger' },
    { name: 'Zeus', key: 'zuus' },
    { name: 'Kunkka', key: 'kunkka' },
    { name: 'Lina', key: 'lina' },
    { name: 'Lion', key: 'lion' },
    { name: 'Shadow Shaman', key: 'shadow_shaman' },
    { name: 'Tidehunter', key: 'tidehunter' },
    { name: 'Witch Doctor', key: 'witch_doctor' },
    { name: 'Lich', key: 'lich' },
    { name: 'Riki', key: 'riki' },
    { name: 'Enigma', key: 'enigma' },
    { name: 'Tinker', key: 'tinker' },
    { name: 'Sniper', key: 'sniper' },
    { name: 'Necrophos', key: 'necrolyte' },
    { name: 'Warlock', key: 'warlock' },
    { name: 'Queen of Pain', key: 'queenofpain' },
    { name: 'Venomancer', key: 'venomancer' },
    { name: 'Faceless Void', key: 'faceless_void' },
    { name: 'Wraith King', key: 'skeleton_king' },
    { name: 'Death Prophet', key: 'death_prophet' },
    { name: 'Phantom Assassin', key: 'phantom_assassin' },
    { name: 'Templar Assassin', key: 'templar_assassin' },
    { name: 'Viper', key: 'viper' },
    { name: 'Luna', key: 'luna' },
    { name: 'Dragon Knight', key: 'dragon_knight' },
    { name: 'Clockwerk', key: 'rattletrap' },
    { name: 'Nature\'s Prophet', key: 'furion' },
    { name: 'Lifestealer', key: 'life_stealer' },
    { name: 'Dark Seer', key: 'dark_seer' },
    { name: 'Clinkz', key: 'clinkz' },
    { name: 'Omniknight', key: 'omniknight' },
    { name: 'Huskar', key: 'huskar' },
    { name: 'Night Stalker', key: 'night_stalker' },
    { name: 'Bounty Hunter', key: 'bounty_hunter' },
    { name: 'Weaver', key: 'weaver' },
    { name: 'Jakiro', key: 'jakiro' },
    { name: 'Batrider', key: 'batrider' },
    { name: 'Spectre', key: 'spectre' },
    { name: 'Doom', key: 'doom_bringer' },
    { name: 'Ursa', key: 'ursa' },
    { name: 'Spirit Breaker', key: 'spirit_breaker' },
    { name: 'Gyrocopter', key: 'gyrocopter' },
    { name: 'Alchemist', key: 'alchemist' },
    { name: 'Invoker', key: 'invoker' },
    { name: 'Silencer', key: 'silencer' },
    { name: 'Outworld Destroyer', key: 'obsidian_destroyer' },
    { name: 'Lycan', key: 'lycan' },
    { name: 'Brewmaster', key: 'brewmaster' },
    { name: 'Chaos Knight', key: 'chaos_knight' },
    { name: 'Meepo', key: 'meepo' },
    { name: 'Ogre Magi', key: 'ogre_magi' },
    { name: 'Undying', key: 'undying' },
    { name: 'Rubick', key: 'rubick' },
    { name: 'Disruptor', key: 'disruptor' },
    { name: 'Nyx Assassin', key: 'nyx_assassin' },
    { name: 'Naga Siren', key: 'naga_siren' },
    { name: 'Keeper of the Light', key: 'keeper_of_the_light' },
    { name: 'Io', key: 'wisp' },
    { name: 'Visage', key: 'visage' },
    { name: 'Slark', key: 'slark' },
    { name: 'Medusa', key: 'medusa' },
    { name: 'Troll Warlord', key: 'troll_warlord' },
    { name: 'Centaur Warrunner', key: 'centaur' },
    { name: 'Magnus', key: 'magnataur' },
    { name: 'Timbersaw', key: 'shredder' },
    { name: 'Bristleback', key: 'bristleback' },
    { name: 'Tusk', key: 'tusk' },
    { name: 'Skywrath Mage', key: 'skywrath_mage' },
    { name: 'Abaddon', key: 'abaddon' },
    { name: 'Elder Titan', key: 'elder_titan' },
    { name: 'Legion Commander', key: 'legion_commander' },
    { name: 'Ember Spirit', key: 'ember_spirit' },
    { name: 'Earth Spirit', key: 'earth_spirit' },
    { name: 'Underlord', key: 'abyssal_underlord' },
    { name: 'Terrorblade', key: 'terrorblade' },
    { name: 'Phoenix', key: 'phoenix' },
    { name: 'Oracle', key: 'oracle' },
    { name: 'Winter Wyvern', key: 'winter_wyvern' },
    { name: 'Arc Warden', key: 'arc_warden' },
    { name: 'Monkey King', key: 'monkey_king' },
    { name: 'Pangolier', key: 'pangolier' },
    { name: 'Dark Willow', key: 'dark_willow' },
    { name: 'Grimstroke', key: 'grimstroke' },
    { name: 'Mars', key: 'mars' },
    { name: 'Void Spirit', key: 'void_spirit' },
    { name: 'Snapfire', key: 'snapfire' },
    { name: 'Hoodwink', key: 'hoodwink' },
    { name: 'Dawnbreaker', key: 'dawnbreaker' },
    { name: 'Marci', key: 'marci' },
    { name: 'Primal Beast', key: 'primal_beast' },
    { name: 'Muerta', key: 'muerta' },
]

async function main() {
    console.log('Creating Dota 2 category...')

    const category = await prisma.category.create({
        data: {
            name: 'Dota 2',
            slug: 'dota-2',
            icon: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_color.png',
            isActive: true,
        },
    })

    console.log(`Category created with id: ${category.id}`)
    console.log(`Seeding ${heroes.length} heroes...`)

    await prisma.character.createMany({
        data: heroes.map(hero => ({
            name: hero.name,
            categoryId: category.id,
            characterImage: `${HERO_BASE_URL}/${hero.key}.png`,
        })),
    })

    console.log(`Done! ${heroes.length} Dota 2 heroes added.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
