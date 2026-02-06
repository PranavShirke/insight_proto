// Real Influencer Database parsed from CSV
// Scoring Formulas:
// Credibility = (0.4 × Influence Score) + (0.3 × Engagement Rate × 100) + (0.3 × Reputation Score)
// Engagement Quality = (Average Likes / Followers) × 100
// InfluenceIQ = Credibility Score + Longevity Score + Engagement Quality Score
// Match % = (TF-IDF Similarity × 0.4) + (Category Match × 0.4) + (Metrics Score × 0.2)

export interface Influencer {
    id: number;
    name: string;
    handle: string;
    category: string;
    region: string;
    country: string;
    followers: number;
    mediaCount: number;
    engagement: number; // ER%
    conversionFactor: number;
    platform: string;
    verified: boolean;
    image: string;
    // Calculated scores
    influenceScore: number;
    reputationScore: number;
    longevityScore: number;
    credibilityScore: number;
    engagementQuality: number;
    influenceIQ: number;
}

// Parse followers from string like "19.2M" or "250k"
const parseFollowers = (str: string): number => {
    if (!str) return 0;
    const clean = str.replace(/['"]/g, '').trim();
    if (clean.includes('M')) {
        return parseFloat(clean.replace('M', '')) * 1000000;
    }
    if (clean.toLowerCase().includes('k')) {
        return parseFloat(clean.toLowerCase().replace('k', '')) * 1000;
    }
    return parseFloat(clean.replace(/,/g, '')) || 0;
};

// Parse media count from string like "1,620"
const parseMediaCount = (str: string): number => {
    if (!str) return 0;
    const clean = str.replace(/['"]/g, '').replace(/,/g, '').replace(/\+/g, '').trim();
    return parseInt(clean) || 0;
};

// Parse engagement rate from string like "2.50%"
const parseEngagement = (str: string): number => {
    if (!str) return 0;
    return parseFloat(str.replace('%', '')) || 0;
};

// Parse conversion factor
const parseConvFactor = (str: string): number => {
    if (!str) return 0.01;
    return parseFloat(str) || 0.01;
};

// Calculate Influence Score based on followers and reach
const calculateInfluenceScore = (followers: number): number => {
    if (followers >= 100000000) return 98 + Math.random() * 2;
    if (followers >= 50000000) return 95 + Math.random() * 3;
    if (followers >= 20000000) return 90 + Math.random() * 5;
    if (followers >= 10000000) return 85 + Math.random() * 5;
    if (followers >= 5000000) return 78 + Math.random() * 7;
    if (followers >= 1000000) return 70 + Math.random() * 8;
    if (followers >= 500000) return 60 + Math.random() * 10;
    if (followers >= 100000) return 50 + Math.random() * 10;
    return 40 + Math.random() * 10;
};

// Calculate Reputation Score based on media count and consistency
const calculateReputationScore = (mediaCount: number, engagement: number): number => {
    const baseScore = Math.min(90, 50 + (mediaCount / 100));
    const engagementBonus = Math.min(10, engagement * 2);
    return Math.min(100, baseScore + engagementBonus);
};

// Calculate Longevity Score based on media count (more content = longer career)
const calculateLongevityScore = (mediaCount: number): number => {
    if (mediaCount >= 5000) return 95 + Math.random() * 5;
    if (mediaCount >= 3000) return 85 + Math.random() * 10;
    if (mediaCount >= 1000) return 70 + Math.random() * 15;
    if (mediaCount >= 500) return 55 + Math.random() * 15;
    return 40 + Math.random() * 15;
};

// Calculate Credibility Score using formula:
// Credibility = (0.4 × Influence Score) + (0.3 × Engagement Rate × 100) + (0.3 × Reputation Score)
const calculateCredibilityScore = (influenceScore: number, engagement: number, reputationScore: number): number => {
    const score = (0.4 * influenceScore) + (0.3 * Math.min(engagement * 100, 100)) + (0.3 * reputationScore);
    return Math.min(100, Math.max(0, score));
};

// Calculate Engagement Quality using formula:
// Engagement Quality = (Average Likes / Followers) × 100
// Since we don't have avgLikes, we estimate from engagement rate
const calculateEngagementQuality = (_followers: number, engagement: number): number => {
    // Engagement rate is already likes+comments/followers, so we use it directly
    return Math.min(100, engagement * 10); // Scale to 0-100
};

// Calculate InfluenceIQ using formula:
// InfluenceIQ = Credibility Score + Longevity Score + Engagement Quality Score
const calculateInfluenceIQ = (credibility: number, longevity: number, engagementQuality: number): number => {
    // Normalize to 0-100 scale (sum of 3 scores each max 100, so divide by 3)
    return (credibility + longevity + engagementQuality) / 3;
};

// Get country flag based on region
const getCountryFlag = (region: string): string => {
    const flags: Record<string, string> = {
        'Global': '🌐',
        'India': '🇮🇳',
        'US': '🇺🇸',
        'USA': '🇺🇸',
        'UK': '🇬🇧',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'Germany': '🇩🇪',
        'Italy': '🇮🇹',
        'France': '🇫🇷',
        'Japan': '🇯🇵',
        'Brazil': '🇧🇷',
        'UAE': '🇦🇪',
        'Singapore': '🇸🇬',
    };
    return flags[region] || '🌐';
};

// Determine platform based on category and follower patterns
const determinePlatform = (name: string, category: string): string => {
    const youtubers = ['Marques Brownlee', 'Technical Guruji', 'Mrwhosetheboss', 'Linus Tech Tips', 
        'iJustine', 'Unbox Therapy', 'Austin Evans', 'Dave2D', 'TechBurner', 'Beebom', 
        'Trakin Tech', 'Geekyranjit', 'Sara Dietschy', 'Techno Ruhez', 'Lew Later',
        'Emma Chamberlain', 'Logan Paul', 'David Dobrik', 'Prajakta Koli', 'Bhuvan Bam',
        'CarryMinati', 'Ashish Chanchlani', 'Casey Neistat', 'MrBeast', 'PewDiePie',
        'Mortal', 'Techno Gamerz', 'Graham Stephan', 'Physics Wallah', 'Lost LeBlanc',
        'FunForLouis'];
    
    if (youtubers.some(yt => name.includes(yt))) return 'youtube';
    if (category === 'Fashion' || category === 'Beauty' || category === 'Travel') return 'instagram';
    if (category === 'Gaming') return 'youtube';
    if (category === 'Tech') return 'youtube';
    return Math.random() > 0.5 ? 'instagram' : 'youtube';
};

// Raw data from CSV
const rawData: Array<{name: string; region: string; category: string; followers: string; mediaCount: string; engagement: string; convFactor: string}> = [
    { name: 'Marques Brownlee (MKBHD)', region: 'Global', category: 'Tech', followers: '19.2M', mediaCount: '1,620', engagement: '2.50%', convFactor: '0.012' },
    { name: 'Technical Guruji', region: 'India', category: 'Tech', followers: '23.5M', mediaCount: '5,400', engagement: '1.10%', convFactor: '0.01' },
    { name: 'Shlok Srivastava (TechBurner)', region: 'India', category: 'Tech', followers: '4.8M', mediaCount: '950', engagement: '4.20%', convFactor: '0.018' },
    { name: 'Mrwhosetheboss', region: 'Global', category: 'Tech', followers: '18.1M', mediaCount: '1,100', engagement: '3.10%', convFactor: '0.014' },
    { name: 'Trakin Tech (Arun)', region: 'India', category: 'Tech', followers: '14.2M', mediaCount: '3,200', engagement: '1.80%', convFactor: '0.013' },
    { name: 'Linus Tech Tips', region: 'Global', category: 'Tech', followers: '15.8M', mediaCount: '6,200', engagement: '2.90%', convFactor: '0.015' },
    { name: 'Geekyranjit', region: 'India', category: 'Tech', followers: '3.3M', mediaCount: '3,100', engagement: '1.20%', convFactor: '0.009' },
    { name: 'iJustine', region: 'Global', category: 'Tech', followers: '7.1M', mediaCount: '4,500', engagement: '1.50%', convFactor: '0.011' },
    { name: 'Beebom', region: 'India', category: 'Tech', followers: '3.2M', mediaCount: '1,200', engagement: '3.80%', convFactor: '0.016' },
    { name: 'Austin Evans', region: 'Global', category: 'Tech', followers: '5.4M', mediaCount: '2,100', engagement: '2.00%', convFactor: '0.012' },
    { name: 'Rajiv Makhni', region: 'India', category: 'Tech', followers: '1.1M', mediaCount: '2,800', engagement: '1.40%', convFactor: '0.01' },
    { name: 'Dave2D', region: 'Global', category: 'Tech', followers: '3.7M', mediaCount: '850', engagement: '4.50%', convFactor: '0.019' },
    { name: 'Sugandha (Tech Gal)', region: 'India', category: 'Tech', followers: '250k', mediaCount: '420', engagement: '6.20%', convFactor: '0.025' },
    { name: 'Unbox Therapy', region: 'Global', category: 'Tech', followers: '21.5M', mediaCount: '2,900', engagement: '1.20%', convFactor: '0.008' },
    { name: 'Gyan Therapy', region: 'India', category: 'Tech', followers: '3.1M', mediaCount: '800', engagement: '2.20%', convFactor: '0.014' },
    { name: 'Sara Dietschy', region: 'Global', category: 'Tech', followers: '950k', mediaCount: '1,100', engagement: '3.90%', convFactor: '0.02' },
    { name: 'Techno Ruhez', region: 'India', category: 'Tech', followers: '4.2M', mediaCount: '2,100', engagement: '1.60%', convFactor: '0.011' },
    { name: 'Lew Later', region: 'Global', category: 'Tech', followers: '1.8M', mediaCount: '3,400', engagement: '2.10%', convFactor: '0.01' },
    { name: 'Tech Unboxing', region: 'India', category: 'Tech', followers: '500k', mediaCount: '1,500', engagement: '2.50%', convFactor: '0.013' },
    { name: 'Technical Yogi', region: 'India', category: 'Tech', followers: '4.1M', mediaCount: '1,900', engagement: '1.30%', convFactor: '0.009' },
    { name: 'Nancy Tyagi', region: 'India', category: 'Fashion', followers: '3.2M', mediaCount: '450', engagement: '8.50%', convFactor: '0.045' },
    { name: 'Chiara Ferragni', region: 'Global', category: 'Fashion', followers: '29.5M', mediaCount: '16,200', engagement: '0.80%', convFactor: '0.015' },
    { name: 'Komal Pandey', region: 'India', category: 'Fashion', followers: '1.9M', mediaCount: '1,550', engagement: '3.80%', convFactor: '0.035' },
    { name: 'Wisdom Kaye', region: 'Global', category: 'Fashion', followers: '12.0M', mediaCount: '1,100', engagement: '7.20%', convFactor: '0.04' },
    { name: 'Siddharth Batra', region: 'India', category: 'Fashion', followers: '310k', mediaCount: '1,400', engagement: '4.10%', convFactor: '0.03' },
    { name: 'Huda Kattan', region: 'Global', category: 'Beauty', followers: '54.1M', mediaCount: '8,200', engagement: '0.60%', convFactor: '0.012' },
    { name: 'Malvika Sitlani', region: 'India', category: 'Beauty', followers: '650k', mediaCount: '2,800', engagement: '2.50%', convFactor: '0.028' },
    { name: 'Leonie Hanne', region: 'Global', category: 'Fashion', followers: '4.7M', mediaCount: '5,100', engagement: '2.20%', convFactor: '0.025' },
    { name: 'Kritika Khurana', region: 'India', category: 'Fashion', followers: '1.8M', mediaCount: '3,100', engagement: '2.90%', convFactor: '0.022' },
    { name: 'Mariano Di Vaio', region: 'Global', category: 'Fashion', followers: '7.1M', mediaCount: '7,400', engagement: '1.10%', convFactor: '0.018' },
    { name: 'Masoom Minawala', region: 'India', category: 'Fashion', followers: '1.4M', mediaCount: '4,200', engagement: '2.10%', convFactor: '0.026' },
    { name: 'James Charles', region: 'Global', category: 'Beauty', followers: '24.5M', mediaCount: '1,400', engagement: '1.80%', convFactor: '0.02' },
    { name: 'Niti Taylor', region: 'India', category: 'Beauty', followers: '3.8M', mediaCount: '1,200', engagement: '3.20%', convFactor: '0.024' },
    { name: 'Aimee Song', region: 'Global', category: 'Fashion', followers: '7.4M', mediaCount: '9,100', engagement: '0.90%', convFactor: '0.016' },
    { name: 'Diipa Khosla', region: 'India', category: 'Fashion', followers: '2.1M', mediaCount: '2,800', engagement: '1.70%', convFactor: '0.021' },
    { name: 'Danielle Bernstein', region: 'Global', category: 'Fashion', followers: '3.1M', mediaCount: '14000', engagement: '0.70%', convFactor: '0.014' },
    { name: 'Sufi Motiwala', region: 'India', category: 'Fashion', followers: '240k', mediaCount: '380', engagement: '9.10%', convFactor: '0.05' },
    { name: 'NikkieTutorials', region: 'Global', category: 'Beauty', followers: '19.5M', mediaCount: '1,800', engagement: '2.40%', convFactor: '0.022' },
    { name: 'Sakshi Sindwani', region: 'India', category: 'Fashion', followers: '610k', mediaCount: '1,100', engagement: '4.80%', convFactor: '0.032' },
    { name: 'Shreya Jain', region: 'India', category: 'Beauty', followers: '480k', mediaCount: '2,400', engagement: '3.10%', convFactor: '0.027' },
    { name: 'Emma Chamberlain', region: 'Global', category: 'Lifestyle', followers: '16.2M', mediaCount: '1,400', engagement: '5.50%', convFactor: '0.015' },
    { name: 'Prajakta Koli (MostlySane)', region: 'India', category: 'Lifestyle', followers: '8.8M', mediaCount: '2,100', engagement: '2.10%', convFactor: '0.012' },
    { name: 'Kusha Kapila', region: 'India', category: 'Lifestyle', followers: '3.7M', mediaCount: '1,850', engagement: '3.40%', convFactor: '0.018' },
    { name: 'Logan Paul', region: 'Global', category: 'Lifestyle', followers: '27.1M', mediaCount: '1,200', engagement: '2.80%', convFactor: '0.009' },
    { name: 'Ranveer Allahbadia', region: 'India', category: 'Lifestyle', followers: '3.5M', mediaCount: '2,400', engagement: '3.20%', convFactor: '0.022' },
    { name: 'Alex Cooper', region: 'Global', category: 'Lifestyle', followers: '5.2M', mediaCount: '800', engagement: '4.80%', convFactor: '0.014' },
    { name: 'Dolly Singh', region: 'India', category: 'Lifestyle', followers: '1.6M', mediaCount: '1,700', engagement: '3.90%', convFactor: '0.02' },
    { name: 'David Dobrik', region: 'Global', category: 'Lifestyle', followers: '10.5M', mediaCount: '600', engagement: '6.10%', convFactor: '0.007' },
    { name: 'Gaurav Taneja (Flying Beast)', region: 'India', category: 'Lifestyle', followers: '3.9M', mediaCount: '1,400', engagement: '4.50%', convFactor: '0.025' },
    { name: 'Dixie D\'Amelio', region: 'Global', category: 'Lifestyle', followers: '22.4M', mediaCount: '950', engagement: '1.20%', convFactor: '0.008' },
    { name: 'Bhuvan Bam', region: 'India', category: 'Lifestyle', followers: '19.5M', mediaCount: '500', engagement: '7.20%', convFactor: '0.011' },
    { name: 'MrBeast', region: 'Global', category: 'Lifestyle', followers: '240M', mediaCount: '780', engagement: '12.00%', convFactor: '0.005' },
    { name: 'CarryMinati', region: 'India', category: 'Lifestyle', followers: '21.2M', mediaCount: '600', engagement: '6.80%', convFactor: '0.006' },
    { name: 'Charli D\'Amelio', region: 'Global', category: 'Lifestyle', followers: '151M', mediaCount: '2,100', engagement: '0.90%', convFactor: '0.004' },
    { name: 'Ashish Chanchlani', region: 'India', category: 'Lifestyle', followers: '15.1M', mediaCount: '550', engagement: '5.40%', convFactor: '0.009' },
    { name: 'Addison Rae', region: 'Global', category: 'Lifestyle', followers: '36.8M', mediaCount: '1,100', engagement: '1.50%', convFactor: '0.007' },
    { name: 'Mithila Palkar', region: 'India', category: 'Lifestyle', followers: '4.1M', mediaCount: '1,300', engagement: '2.60%', convFactor: '0.014' },
    { name: 'Casey Neistat', region: 'Global', category: 'Lifestyle', followers: '3.1M', mediaCount: '1,200', engagement: '3.50%', convFactor: '0.018' },
    { name: 'Mallika Dua', region: 'India', category: 'Lifestyle', followers: '1.1M', mediaCount: '2,200', engagement: '2.00%', convFactor: '0.013' },
    { name: 'Harsh Beniwal', region: 'India', category: 'Lifestyle', followers: '6.5M', mediaCount: '450', engagement: '4.90%', convFactor: '0.01' },
    { name: 'Chris Burkard', region: 'Global', category: 'Travel', followers: '4.0M', mediaCount: '3,850', engagement: '1.50%', convFactor: '0.008' },
    { name: 'Anunay Sood', region: 'India', category: 'Travel', followers: '1.2M', mediaCount: '950', engagement: '5.40%', convFactor: '0.012' },
    { name: 'Larissa D\'Sa', region: 'India', category: 'Travel', followers: '750k', mediaCount: '2,100', engagement: '4.10%', convFactor: '0.015' },
    { name: 'Sam Kolder', region: 'Global', category: 'Travel', followers: '1.8M', mediaCount: '420', engagement: '7.10%', convFactor: '0.02' },
    { name: 'Varun Aditya', region: 'India', category: 'Travel', followers: '3.9M', mediaCount: '1,150', engagement: '6.50%', convFactor: '0.007' },
    { name: 'Lost LeBlanc', region: 'Global', category: 'Travel', followers: '780k', mediaCount: '1,400', engagement: '3.20%', convFactor: '0.018' },
    { name: 'Ronnie & Barty', region: 'India', category: 'Travel', followers: '410k', mediaCount: '600', engagement: '5.90%', convFactor: '0.022' },
    { name: 'Murad Osmann', region: 'Global', category: 'Travel', followers: '3.4M', mediaCount: '900', engagement: '1.20%', convFactor: '0.005' },
    { name: 'Shivya Nath', region: 'India', category: 'Travel', followers: '120k', mediaCount: '1,800', engagement: '3.80%', convFactor: '0.028' },
    { name: 'FunForLouis', region: 'Global', category: 'Travel', followers: '1.2M', mediaCount: '2,400', engagement: '1.10%', convFactor: '0.01' },
    { name: 'Shenaz Treasury', region: 'India', category: 'Travel', followers: '1.1M', mediaCount: '4,200', engagement: '2.40%', convFactor: '0.014' },
    { name: 'Chelsea Kauai', region: 'Global', category: 'Travel', followers: '1.3M', mediaCount: '850', engagement: '6.80%', convFactor: '0.025' },
    { name: 'Savi & Vid (Bruised Passports)', region: 'India', category: 'Travel', followers: '1.5M', mediaCount: '3,100', engagement: '2.10%', convFactor: '0.019' },
    { name: 'Fearless & Far', region: 'Global', category: 'Travel', followers: '850k', mediaCount: '1,200', engagement: '4.30%', convFactor: '0.016' },
    { name: 'Abhinav Chandel', region: 'India', category: 'Travel', followers: '280k', mediaCount: '1,500', engagement: '5.10%', convFactor: '0.021' },
    { name: 'Jack Morris (doyoutravel)', region: 'Global', category: 'Travel', followers: '2.5M', mediaCount: '900', engagement: '1.80%', convFactor: '0.011' },
    { name: 'Naveen Rawat', region: 'India', category: 'Travel', followers: '350k', mediaCount: '800', engagement: '4.70%', convFactor: '0.02' },
    { name: 'Sorelle Amore', region: 'Global', category: 'Travel', followers: '450k', mediaCount: '1,100', engagement: '3.50%', convFactor: '0.014' },
    { name: 'Aakash Malhotra', region: 'India', category: 'Travel', followers: '600k', mediaCount: '1,200', engagement: '3.90%', convFactor: '0.018' },
    { name: 'Kamiya Jani (Curly Tales)', region: 'India', category: 'Travel', followers: '2.8M', mediaCount: '5,400', engagement: '1.60%', convFactor: '0.015' },
    { name: 'Tarini Shah', region: 'India', category: 'Lifestyle', followers: '560k', mediaCount: '610', engagement: '2.80%', convFactor: '0.038' },
    { name: 'Aastha Shah', region: 'India', category: 'Lifestyle', followers: '1.7M', mediaCount: '1,150', engagement: '4.20%', convFactor: '0.032' },
    { name: 'Taneesho (Taneesha)', region: 'India', category: 'Lifestyle', followers: '480k', mediaCount: '450', engagement: '5.10%', convFactor: '0.04' },
    { name: 'Agasthya Shah', region: 'India', category: 'Lifestyle', followers: '350k', mediaCount: '390', engagement: '6.20%', convFactor: '0.035' },
    { name: 'Dev Raiyani', region: 'India', category: 'Lifestyle', followers: '410k', mediaCount: '320', engagement: '5.80%', convFactor: '0.03' },
    { name: 'Alix Earle', region: 'Global', category: 'Lifestyle', followers: '5.1M', mediaCount: '900', engagement: '11.20%', convFactor: '0.055' },
    { name: 'Sejal Kumar', region: 'India', category: 'Lifestyle', followers: '1.4M', mediaCount: '3,100', engagement: '1.90%', convFactor: '0.022' },
    { name: 'Ahsaas Channa', region: 'India', category: 'Lifestyle', followers: '3.8M', mediaCount: '1,200', engagement: '3.10%', convFactor: '0.018' },
    { name: 'Sharan Hegde', region: 'India', category: 'Finance', followers: '2.6M', mediaCount: '850', engagement: '4.50%', convFactor: '0.028' },
    { name: 'Ankur Warikoo', region: 'India', category: 'Finance', followers: '3.2M', mediaCount: '4,100', engagement: '2.20%', convFactor: '0.02' },
    { name: 'Graham Stephan', region: 'Global', category: 'Finance', followers: '4.6M', mediaCount: '1,200', engagement: '2.10%', convFactor: '0.022' },
    { name: 'Mortal (Naman)', region: 'India', category: 'Gaming', followers: '5.5M', mediaCount: '1,400', engagement: '4.10%', convFactor: '0.012' },
    { name: 'Techno Gamerz', region: 'India', category: 'Gaming', followers: '35M', mediaCount: '950', engagement: '3.80%', convFactor: '0.009' },
    { name: 'PewDiePie', region: 'Global', category: 'Gaming', followers: '111M', mediaCount: '4,700', engagement: '1.50%', convFactor: '0.005' },
    { name: 'PhysicsWallah', region: 'India', category: 'Education', followers: '12M', mediaCount: '5,000', engagement: '5.20%', convFactor: '0.045' },
    { name: 'Your Food Lab', region: 'India', category: 'Food', followers: '4.5M', mediaCount: '2,100', engagement: '3.90%', convFactor: '0.031' },
    { name: 'Ershad (AndroInsider)', region: 'India', category: 'Tech', followers: '1.1M', mediaCount: '1,800', engagement: '2.40%', convFactor: '0.018' },
];

// Process raw data into full influencer objects with calculated scores
export const INFLUENCER_DATABASE: Influencer[] = rawData.map((raw, index) => {
    const followers = parseFollowers(raw.followers);
    const mediaCount = parseMediaCount(raw.mediaCount);
    const engagement = parseEngagement(raw.engagement);
    const conversionFactor = parseConvFactor(raw.convFactor);
    
    // Calculate base scores
    const influenceScore = calculateInfluenceScore(followers);
    const reputationScore = calculateReputationScore(mediaCount, engagement);
    const longevityScore = calculateLongevityScore(mediaCount);
    
    // Calculate derived scores using formulas
    const credibilityScore = calculateCredibilityScore(influenceScore, engagement, reputationScore);
    const engagementQuality = calculateEngagementQuality(followers, engagement);
    const influenceIQ = calculateInfluenceIQ(credibilityScore, longevityScore, engagementQuality);
    
    // Clean name (remove parenthetical notes for handle)
    const cleanName = raw.name.replace(/\s*\([^)]*\)/g, '').trim();
    const handle = '@' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
    
    return {
        id: index + 1,
        name: raw.name,
        handle,
        category: raw.category,
        region: raw.region,
        country: getCountryFlag(raw.region),
        followers,
        mediaCount,
        engagement,
        conversionFactor,
        platform: determinePlatform(raw.name, raw.category),
        verified: followers > 500000,
        image: `https://i.pravatar.cc/150?u=${handle}`,
        influenceScore: Math.round(influenceScore * 10) / 10,
        reputationScore: Math.round(reputationScore * 10) / 10,
        longevityScore: Math.round(longevityScore * 10) / 10,
        credibilityScore: Math.round(credibilityScore * 10) / 10,
        engagementQuality: Math.round(engagementQuality * 10) / 10,
        influenceIQ: Math.round(influenceIQ * 10) / 10,
    };
});

// Calculate Match Percentage using formula:
// Match % = (TF-IDF Similarity × 0.4) + (Category Match × 0.4) + (Metrics Score × 0.2)
export const calculateMatchPercentage = (
    influencer: Influencer,
    targetCategory: string,
    targetBudget: string,
    targetPlatform: string,
    _campaignGoal: string
): number => {
    // Category Match (0 or 100)
    const categoryMatch = influencer.category.toLowerCase() === targetCategory.toLowerCase() ? 100 : 
                          influencer.category === 'Beauty' && targetCategory === 'Fashion' ? 80 : 0;
    
    // TF-IDF Similarity (simulated based on content relevance)
    // Higher engagement and relevance = higher TF-IDF score
    const tfidfSimilarity = Math.min(100, 
        (influencer.engagement * 10) + 
        (influencer.credibilityScore * 0.3) + 
        (categoryMatch > 0 ? 30 : 0)
    );
    
    // Metrics Score based on budget alignment and platform match
    let metricsScore = 50;
    
    // Budget alignment
    const budgetRanges: Record<string, [number, number]> = {
        'small': [0, 500000],
        'medium': [500000, 5000000],
        'large': [5000000, 20000000],
        'enterprise': [20000000, Infinity]
    };
    const [minF, maxF] = budgetRanges[targetBudget] || [0, Infinity];
    if (influencer.followers >= minF && influencer.followers <= maxF) {
        metricsScore += 25;
    }
    
    // Platform match
    if (targetPlatform === 'any' || influencer.platform === targetPlatform) {
        metricsScore += 25;
    }
    
    // Apply formula: Match % = (TF-IDF × 0.4) + (Category Match × 0.4) + (Metrics × 0.2)
    const matchPercentage = (tfidfSimilarity * 0.4) + (categoryMatch * 0.4) + (metricsScore * 0.2);
    
    return Math.min(100, Math.round(matchPercentage));
};

export const CATEGORIES = ['All', 'Tech', 'Fashion', 'Beauty', 'Lifestyle', 'Gaming', 'Travel', 'Finance', 'Food', 'Education'];
export const REGIONS = ['All', 'Global', 'India', 'US', 'UK', 'Canada', 'Australia', 'Germany', 'Italy', 'UAE', 'Singapore'];
export const PLATFORMS = ['All', 'instagram', 'youtube', 'twitter', 'tiktok'];
