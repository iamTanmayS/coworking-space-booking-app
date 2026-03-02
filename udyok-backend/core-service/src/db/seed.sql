-- ============================================================
-- UDYOK SEED DATA
-- Run after migrations. Safe to re-run (uses ON CONFLICT).
-- ============================================================

-- ========================  OPERATORS  ========================
INSERT INTO operators (id, name, email, phone, avatar, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Priya Sharma',        'priya.sharma@workhive.in',     '+91 98201 45678', 'https://i.pravatar.cc/150?img=49', true),
('550e8400-e29b-41d4-a716-446655440002', 'Rahul Mehta',         'rahul@deskhub.co.in',          '+91 98765 43210', 'https://i.pravatar.cc/150?img=12', true),
('550e8400-e29b-41d4-a716-446655440003', 'Ananya Iyer',         'ananya@codebrew.cafe',         '+91 99001 22334', 'https://i.pravatar.cc/150?img=32', true),
('550e8400-e29b-41d4-a716-446655440004', 'Vikram Singh',        'vikram@nexuswork.in',          '+91 88261 90012', 'https://i.pravatar.cc/150?img=59', true),
('550e8400-e29b-41d4-a716-446655440005', 'Neha Kapoor',         'neha@artloft.studio',          '+91 77009 88112', 'https://i.pravatar.cc/150?img=44', true),
('550e8400-e29b-41d4-a716-446655440006', 'Arjun Reddy',         'arjun@peakspace.in',           '+91 90001 55667', 'https://i.pravatar.cc/150?img=57', true),
('550e8400-e29b-41d4-a716-446655440007', 'Meera Joshi',         'meera@thehivebangalore.com',   '+91 81234 56789', 'https://i.pravatar.cc/150?img=23', true),
('550e8400-e29b-41d4-a716-446655440008', 'Kabir Malhotra',      'kabir@workstudio.co',          '+91 70098 12345', 'https://i.pravatar.cc/150?img=60', false)
ON CONFLICT (email) DO NOTHING;


-- ========================  SPACES  ========================
INSERT INTO spaces (id, owner_id, name, description, category, price_per_hour, city, address, latitude, longitude, amenities, rating, total_reviews) VALUES

-- Mumbai
('11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440001',
 'WorkHive Premium Boardroom',
 'An elegant 16-seater boardroom in the heart of BKC with floor-to-ceiling glass walls, a 75-inch 4K display, Dolby conference audio, and a dedicated reception team. Ideal for investor pitches, board meetings, and high-stakes client presentations.',
 'Conference', 1500, 'Mumbai', 'One BKC, G Block, Bandra Kurla Complex', 19.0658, 72.8686,
 '["High-Speed WiFi", "4K Display", "Dolby Audio", "Video Conferencing", "Catering Service", "Reception Desk", "AC"]', 4.9, 87),

('22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440001',
 'WorkHive Open Desk — Lower Parel',
 'Bright, open-plan hot desks in a converted textile mill. High ceilings, industrial-chic interiors, unlimited filter coffee, and a rooftop terrace for breaks. Walking distance from Lower Parel station.',
 'Desk', 250, 'Mumbai', 'Kamala Mills Compound, Lower Parel', 18.9960, 72.8270,
 '["WiFi", "Unlimited Coffee", "Rooftop Terrace", "Ergonomic Chairs", "Power Backup", "Locker"]', 4.6, 214),

('33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440004',
 'Nexus Work — Andheri Tech Hub',
 'A modern coworking floor in Andheri East''s IT corridor. Dedicated desks with dual-monitor setups, soundproof meeting pods, 500 Mbps leased-line internet, and 24/7 access with biometric entry.',
 'Desk', 400, 'Mumbai', 'Marol MIDC, Andheri East', 19.1136, 72.8697,
 '["500 Mbps WiFi", "Dual Monitors", "Meeting Pods", "24/7 Access", "Biometric Entry", "Pantry", "Printing"]', 4.7, 162),

-- Bangalore
('44444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440003',
 'CodeBrew Café — Koramangala',
 'Where great code meets great coffee. A curated café-coworking hybrid with specialty pour-overs, standing desks, and a no-meetings quiet zone. Perfect for indie developers, writers, and freelancers who thrive on caffeine.',
 'Desk', 200, 'Bangalore', '80 Feet Road, Koramangala 4th Block', 12.9352, 77.6245,
 '["WiFi", "Specialty Coffee", "Standing Desks", "Quiet Zone", "Ergonomic Chairs", "Natural Light"]', 4.8, 312),

('55555555-5555-5555-5555-555555555555', '550e8400-e29b-41d4-a716-446655440007',
 'The Hive — HSR Layout',
 'A vibrant 4,000 sq ft coworking space with dedicated desks, private cabins, and a podcast recording booth. Surrounded by cafés and within walking distance of HSR BDA Complex.',
 'Desk', 350, 'Bangalore', '27th Main, HSR Layout Sector 1', 12.9121, 77.6446,
 '["Gigabit WiFi", "Private Cabins", "Podcast Booth", "Standing Desks", "Nap Room", "Cafeteria"]', 4.7, 189),

('66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440007',
 'The Hive — Executive Meeting Room',
 'A polished 10-seater meeting room at The Hive with a 65-inch smart TV, wireless screen-sharing, and complimentary chai and snacks. Book by the hour for focused team discussions.',
 'Conference', 800, 'Bangalore', '27th Main, HSR Layout Sector 1', 12.9123, 77.6448,
 '["Smart TV", "Wireless Casting", "Whiteboard", "Complimentary Chai", "AC", "Sound Insulation"]', 4.9, 76),

-- Delhi NCR
('77777777-7777-7777-7777-777777777777', '550e8400-e29b-41d4-a716-446655440006',
 'PeakSpace — Connaught Place',
 'Premium coworking in the iconic CP inner circle. Heritage building, contemporary interiors, a members-only lounge, and access to a terrace overlooking the gardens. Ideal for consultants and startup founders.',
 'Desk', 500, 'Delhi', 'N Block, Connaught Place', 28.6328, 77.2197,
 '["WiFi", "Members Lounge", "Terrace Access", "Concierge", "Mail Handling", "Printing", "AC"]', 4.8, 143),

('88888888-8888-8888-8888-888888888888', '550e8400-e29b-41d4-a716-446655440005',
 'ArtLoft Creative Studio',
 'A sun-drenched, 2,500 sq ft loft studio in Hauz Khas Village with exposed brick walls, professional lighting rigs, multiple backdrop setups, and a makeup station. Perfect for photographers, videographers, and content creators.',
 'Studio', 1200, 'Delhi', 'Hauz Khas Village, Lane 3', 28.5494, 77.2001,
 '["Professional Lighting", "Backdrops", "Makeup Station", "Changing Room", "Green Screen", "Props"]', 4.9, 94),

('99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440006',
 'PeakSpace — Noida Sector 62',
 'Sprawling 8,000 sq ft coworking campus near the Noida Electronic City metro. Dual-monitor desks, a gaming lounge for breaks, and weekly community events. Popular with tech teams and remote workers.',
 'Desk', 300, 'Noida', 'A Block, Sector 62', 28.6270, 77.3654,
 '["WiFi", "Dual Monitors", "Gaming Lounge", "Event Space", "Parking", "Gym Access", "Cafeteria"]', 4.5, 278),

-- Hyderabad
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '550e8400-e29b-41d4-a716-446655440002',
 'DeskHub — HITEC City',
 'A sleek, futuristic coworking space in the HITEC City IT corridor. Glass-walled private offices, phone booths, a wellness room, and a rooftop café with views of the Hyderabad skyline.',
 'Desk', 350, 'Hyderabad', 'Raheja Mindspace, HITEC City', 17.4486, 78.3808,
 '["WiFi", "Private Offices", "Phone Booths", "Wellness Room", "Rooftop Café", "Power Backup"]', 4.6, 196),

-- Pune
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '550e8400-e29b-41d4-a716-446655440002',
 'DeskHub — Kharadi Innovation Lab',
 'Purpose-built innovation lab with reconfigurable furniture, a prototyping area, VR headsets, and a 120-inch projection wall. Designed for product teams running design sprints and hackathons.',
 'Conference', 900, 'Pune', 'EON IT Park, Kharadi', 18.5530, 73.9452,
 '["120-inch Projection", "VR Headsets", "Reconfigurable Layout", "Prototyping Tools", "WiFi", "Catering"]', 4.8, 58),

-- Jaipur
('cccccccc-cccc-cccc-cccc-cccccccccccc', '550e8400-e29b-41d4-a716-446655440008',
 'WorkStudio — The Pink City Hub',
 'A beautifully restored haveli converted into a coworking space, blending Rajasthani heritage with modern productivity. Courtyard seating, jharokha-window nooks, and artisan chai on tap.',
 'Desk', 180, 'Jaipur', 'Johri Bazaar, Old City', 26.9196, 75.8236,
 '["WiFi", "Courtyard Seating", "Artisan Chai", "Heritage Architecture", "AC", "Quiet Nooks"]', 4.9, 67)

ON CONFLICT (id) DO NOTHING;


-- ========================  SPACE IMAGES  ========================
-- Using verified, high-quality Unsplash photos of offices, coworking spaces, cafés, and studios.

INSERT INTO space_images (space_id, image_url, is_primary, sort_order) VALUES

-- WorkHive Premium Boardroom (Mumbai BKC)
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&q=80', true,  1),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', false, 2),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', false, 3),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80', false, 4),

-- WorkHive Open Desk — Lower Parel
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80', true,  1),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', false, 2),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80', false, 3),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1505409859467-3a796fd5a263?w=800&q=80', false, 4),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1517502884422-41eae6c63f6e?w=800&q=80', false, 5),

-- Nexus Work — Andheri Tech Hub
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80', true,  1),
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', false, 2),
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80', false, 3),
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80', false, 4),

-- CodeBrew Café — Koramangala
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80', true,  1),
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', false, 2),
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', false, 3),
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', false, 4),
('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', false, 5),

-- The Hive — HSR Layout
('55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', true,  1),
('55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', false, 2),
('55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80', false, 3),
('55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', false, 4),

-- The Hive — Executive Meeting Room
('66666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80', true,  1),
('66666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1517502884422-41eae6c63f6e?w=800&q=80', false, 2),
('66666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80', false, 3),
('66666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80', false, 4),

-- PeakSpace — Connaught Place
('77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800&q=80', true,  1),
('77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80', false, 2),
('77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&q=80', false, 3),
('77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&q=80', false, 4),
('77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', false, 5),

-- ArtLoft Creative Studio
('88888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?w=800&q=80', true,  1),
('88888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80', false, 2),
('88888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&q=80', false, 3),
('88888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1604076913837-52ab5f6e5f24?w=800&q=80', false, 4),
('88888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80', false, 5),

-- PeakSpace — Noida Sector 62
('99999999-9999-9999-9999-999999999999', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80', true,  1),
('99999999-9999-9999-9999-999999999999', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80', false, 2),
('99999999-9999-9999-9999-999999999999', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', false, 3),
('99999999-9999-9999-9999-999999999999', 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&q=80', false, 4),

-- DeskHub — HITEC City
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', true,  1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80', false, 2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', false, 3),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80', false, 4),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', false, 5),

-- DeskHub — Kharadi Innovation Lab
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', true,  1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1517502884422-41eae6c63f6e?w=800&q=80', false, 2),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&q=80', false, 3),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80', false, 4),

-- WorkStudio — The Pink City Hub (Jaipur)
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1600494603473-0ee46fd0be29?w=800&q=80', true,  1),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', false, 2),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1505409859467-3a796fd5a263?w=800&q=80', false, 3),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', false, 4),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', false, 5);


-- ========================  REVIEWS  ========================
-- Using the first registered user as the reviewer (safe for demo).

INSERT INTO reviews (user_id, space_id, title, description, rating) VALUES

-- WorkHive Premium Boardroom
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '11111111-1111-1111-1111-111111111111',
 'Best boardroom in BKC',
 'We hosted our Series A investor meeting here and the setup was flawless. The AV quality is outstanding, the catering was delicious, and our investors remarked on how professional the venue felt. Will definitely book again.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1 OFFSET 0), '11111111-1111-1111-1111-111111111111',
 'Perfect for client pitches',
 'Used this for a 3-hour client presentation. The 4K display made our designs look incredible and the Dolby audio was crystal clear for our remote participants. Reception staff was very helpful.',
 5),

-- WorkHive Open Desk — Lower Parel
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '22222222-2222-2222-2222-222222222222',
 'Great vibe, amazing coffee',
 'The industrial-chic aesthetic is so motivating. I love the high ceilings and natural light. The rooftop terrace is a great perk for afternoon breaks. Coffee quality is genuinely good — not the usual office stuff.',
 4),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '22222222-2222-2222-2222-222222222222',
 'Solid for daily coworking',
 'Been coming here 4 days a week for 2 months now. Reliable WiFi, comfortable chairs, and the commute from Lower Parel station is just 5 minutes. Only wish they had more meeting rooms.',
 4),

-- Nexus Work — Andheri Tech Hub
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '33333333-3333-3333-3333-333333333333',
 'Dual monitors are a game changer',
 'As a developer, having dual monitors included in the desk package is unbeatable at this price point. The 500 Mbps internet actually delivers on its promise — I ran speed tests. Meeting pods are soundproof and easy to book.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '33333333-3333-3333-3333-333333333333',
 'Reliable 24/7 access',
 'I often work late and the biometric entry system makes night access hassle-free. The pantry is well-stocked and the cleaning staff keeps everything spotless even at midnight.',
 4),

-- CodeBrew Café — Koramangala
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '44444444-4444-4444-4444-444444444444',
 'My favourite place to code in Bangalore',
 'The quiet zone policy is actually enforced, which is rare. The specialty pour-overs are exceptional — they source beans from Coorg estates. Standing desks are a nice option when I need to stretch. Highly recommend for solo developers.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '44444444-4444-4444-4444-444444444444',
 'Cozy and productive',
 'Feels more like a premium café than a coworking space, in the best way. The natural light is wonderful and the ambient noise level is just right for focused work. Gets a bit crowded after 3 PM though.',
 4),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '44444444-4444-4444-4444-444444444444',
 'Perfect for freelancers',
 'At ₹200/hour with unlimited coffee, this is incredible value in Koramangala. The Wifi is fast enough for video calls and the staff remembers your name after the second visit. Love it.',
 5),

-- The Hive — HSR Layout
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '55555555-5555-5555-5555-555555555555',
 'The nap room is genius',
 'Who knew a 20-minute power nap could make your afternoon so much more productive? The Hive has thought of everything — podcast booth, nap room, even a cafeteria with proper South Indian meals.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '55555555-5555-5555-5555-555555555555',
 'Great community',
 'Beyond the excellent facilities, what keeps me coming back is the community. The weekly events are genuinely useful — last week had a session on GST filing for freelancers.',
 4),

-- The Hive — Executive Meeting Room
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '66666666-6666-6666-6666-666666666666',
 'Complimentary chai sealed the deal',
 'Booked this for a 2-hour team retrospective. The wireless casting worked instantly with everyone''s laptop — no awkward adapter hunting. The complimentary chai and biscuits were a lovely touch. Very well maintained.',
 5),

-- PeakSpace — Connaught Place
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '77777777-7777-7777-7777-777777777777',
 'Heritage charm meets modern workspace',
 'Working from a CP heritage building with this kind of fit-out is something else. The terrace with the garden view is perfect for client calls. Mail handling and concierge services make it feel like a proper office.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '77777777-7777-7777-7777-777777777777',
 'Premium but worth every rupee',
 'At ₹500/hr it''s on the pricier side for Delhi, but the location, ambiance, and services justify it easily. The members lounge has great networking opportunities. Metro access is a huge plus.',
 4),

-- ArtLoft Creative Studio
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '88888888-8888-8888-8888-888888888888',
 'Dream studio for content creators',
 'Shot an entire product catalogue here in one day. The lighting rigs are professional-grade (Godox and Profoto), and they have at least 8 different backdrop options. The makeup station is well-lit and clean.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '88888888-8888-8888-8888-888888888888',
 'Well-equipped photography studio',
 'Used this for a fashion shoot. The changing room and green screen are great additions. The Hauz Khas Village location also means there are plenty of outdoor spots nearby for additional shots.',
 5),

-- PeakSpace — Noida Sector 62
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '99999999-9999-9999-9999-999999999999',
 'Best value coworking in Noida',
 'At ₹300/hr you get dual monitors, fast WiFi, and access to a gaming lounge for breaks. The weekly community events are fun and I''ve made some good professional connections here.',
 4),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), '99999999-9999-9999-9999-999999999999',
 'Huge campus, lots of amenities',
 'The 8,000 sq ft space never feels crowded. Parking is free and the gym access is a big bonus. Only concern is the AC can be a bit aggressive in winter — bring a jacket!',
 4),

-- DeskHub — HITEC City
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'Excellent for tech teams',
 'Our 4-person team has been working from here for 3 months. The private offices are well-insulated for calls. The rooftop café has surprisingly good biryani. Wellness room is a nice touch after long coding sessions.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'Modern and well-maintained',
 'Everything feels new and well-maintained. The phone booths are perfect for quick client calls. Power backup kicked in seamlessly during a recent outage — didn''t even notice.',
 4),

-- DeskHub — Kharadi Innovation Lab
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
 'Perfect for our design sprint',
 'We ran a 3-day design sprint here with our product team. The reconfigurable furniture made it easy to switch between group and individual work. The 120-inch projection wall is spectacular for presentations.',
 5),

-- WorkStudio — The Pink City Hub
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), 'cccccccc-cccc-cccc-cccc-cccccccccccc',
 'Most beautiful coworking space I have visited',
 'The restored haveli is absolutely stunning — Instagram-worthy at every corner. The jharokha window nooks are perfect for focused solo work. The artisan chai is the best I''ve had outside of home. Jaipur''s hidden gem.',
 5),
((SELECT id FROM users ORDER BY created_at ASC LIMIT 1), 'cccccccc-cccc-cccc-cccc-cccccccccccc',
 'Heritage meets productivity',
 'The courtyard seating during winter mornings is unbeatable. WiFi is reliable and the quiet atmosphere makes it easy to get into deep work. Very affordable at ₹180/hr given the experience.',
 5);
