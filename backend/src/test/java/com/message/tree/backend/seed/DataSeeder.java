//package com.message.tree.backend;
//
//import com.message.tree.backend.entity.Message;
//import com.message.tree.backend.entity.User;
//import com.message.tree.backend.repository.MessageRepository;
//import com.message.tree.backend.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class DataSeeder implements CommandLineRunner {
//
//    private static final String LEVEL_PREFIX = "Level ";
//
//    private final UserRepository userRepository;
//    private final MessageRepository messageRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Value("${app.seed.enabled:true}")
//    private boolean seedEnabled;
//
//    @Override
//    public void run(String... args) {
//        if (!seedEnabled) {
//            log.info("Data seeding is disabled");
//            return;
//        }
//
//        // Check if data already exists to avoid duplicate insertion
//        if (userRepository.count() > 0) {
//            log.info("Database already contains data, skipping seed data insertion");
//            return;
//        }
//
//        log.info("Starting to seed initial data...");
//
//        // Create seed user data
//        List<User> seedUsers = createSeedUsers();
//        userRepository.saveAll(seedUsers);
//        log.info("Seeded {} users", seedUsers.size());
//
//        // Create seed message data with deep nesting
//        createSeedMessages(seedUsers);
//
//        log.info("Data seeding completed successfully!");
//    }
//
//    private List<User> createSeedUsers() {
//        List<User> users = new ArrayList<>();
//        LocalDateTime now = LocalDateTime.now();
//
//        // Admin user
//        User admin = new User();
//        admin.setUsername("admin");
//        admin.setPassword(passwordEncoder.encode("admin123"));
//        admin.setEmail("admin@example.com");
//        admin.setCreatedAt(now.minusDays(30));
//        users.add(admin);
//
//        // Regular users
//        User alice = new User();
//        alice.setUsername("alice");
//        alice.setPassword(passwordEncoder.encode("alice123"));
//        alice.setEmail("alice@example.com");
//        alice.setCreatedAt(now.minusDays(25));
//        users.add(alice);
//
//        User bob = new User();
//        bob.setUsername("bob");
//        bob.setPassword(passwordEncoder.encode("bob123"));
//        bob.setEmail("bob@example.com");
//        bob.setCreatedAt(now.minusDays(20));
//        users.add(bob);
//
//        User charlie = new User();
//        charlie.setUsername("charlie");
//        charlie.setPassword(passwordEncoder.encode("charlie123"));
//        charlie.setEmail("charlie@example.com");
//        charlie.setCreatedAt(now.minusDays(15));
//        users.add(charlie);
//
//        User diana = new User();
//        diana.setUsername("diana");
//        diana.setPassword(passwordEncoder.encode("diana123"));
//        diana.setEmail("diana@example.com");
//        diana.setCreatedAt(now.minusDays(10));
//        users.add(diana);
//
//        return users;
//    }
//
//    private void createSeedMessages(List<User> users) {
//        LocalDateTime now = LocalDateTime.now();
//
//        // Create root messages
//        List<Message> rootMessages = createRootMessages(users, now);
//
//        // Create deep nested messages (up to 100 levels)
//        createDeepNestedMessages(users, rootMessages, now);
//
//        // Create some additional conversations
//        createAdditionalConversations(users, now);
//    }
//
//    private List<Message> createRootMessages(List<User> users, LocalDateTime now) {
//        List<Message> rootMessages = new ArrayList<>();
//
//        Message welcome = new Message();
//        welcome.setContent("Welcome to our messaging system! This is the first message.");
//        welcome.setUser(users.get(0)); // admin
//        welcome.setCreatedAt(now.minusDays(29));
//        rootMessages.add(welcome);
//
//        Message tech = new Message();
//        tech.setContent("Anyone want to discuss the latest technology trends?");
//        tech.setUser(users.get(1)); // alice
//        tech.setCreatedAt(now.minusDays(28));
//        rootMessages.add(tech);
//
//        Message general = new Message();
//        general.setContent("Nice weather today! What is everyone up to?");
//        general.setUser(users.get(2)); // bob
//        general.setCreatedAt(now.minusDays(27));
//        rootMessages.add(general);
//
//        Message question = new Message();
//        question.setContent("Does anyone know how to optimize Spring Boot application performance?");
//        question.setUser(users.get(3)); // charlie
//        question.setCreatedAt(now.minusDays(26));
//        rootMessages.add(question);
//
//        // Save root messages
//        return messageRepository.saveAll(rootMessages);
//    }
//
//    private void createDeepNestedMessages(List<User> users, List<Message> rootMessages, LocalDateTime now) {
//        // Create 100-level deep conversation starting from the first root message
//        Message currentParent = rootMessages.get(0); // Start from welcome message
//
//        for (int level = 1; level <= 100; level++) {
//            Message reply = new Message();
//
//            // Generate content based on level
//            if (level <= 10) {
//                reply.setContent("Reply level " + level + ": This is getting interesting!");
//            } else if (level <= 30) {
//                reply.setContent(LEVEL_PREFIX + level + ": Deep conversation continues...");
//            } else if (level <= 50) {
//                reply.setContent(LEVEL_PREFIX + level + ": We're going deeper into this topic.");
//            } else if (level <= 75) {
//                reply.setContent(LEVEL_PREFIX + level + ": Amazing how deep we can nest messages!");
//            } else if (level <= 90) {
//                reply.setContent(LEVEL_PREFIX + level + ": Almost reaching the century mark!");
//            } else {
//                reply.setContent(LEVEL_PREFIX + level + ": We're in the final stretch to 100!");
//            }
//
//            // Assign user cyclically
//            reply.setUser(users.get(level % users.size()));
//            reply.setParent(currentParent);
//            reply.setCreatedAt(now.minusDays(29).plusMinutes((long) level * 10));
//
//            // Save and update parent for next iteration
//            currentParent = messageRepository.save(reply);
//
//            log.debug("Created message at level {}", level);
//        }
//
//        log.info("Successfully created 100-level deep message thread");
//    }
//
//    private void createAdditionalConversations(List<User> users, LocalDateTime now) {
//        // Create some additional shorter conversations for variety
//
//        // Tech discussion thread
//        Message techRoot = new Message();
//        techRoot.setContent("Let's discuss the pros and cons of microservices architecture.");
//        techRoot.setUser(users.get(1)); // alice
//        techRoot.setCreatedAt(now.minusDays(20));
//        techRoot = messageRepository.save(techRoot);
//
//        // Create a 20-level discussion
//        Message techParent = techRoot;
//        for (int i = 1; i <= 20; i++) {
//            Message techReply = new Message();
//            techReply.setContent("Tech discussion point " + i + ": " + getTechContent(i));
//            techReply.setUser(users.get(i % users.size()));
//            techReply.setParent(techParent);
//            techReply.setCreatedAt(now.minusDays(20).plusHours(i));
//            techParent = messageRepository.save(techReply);
//        }
//
//        // General chat thread
//        Message chatRoot = new Message();
//        chatRoot.setContent("What are your weekend plans?");
//        chatRoot.setUser(users.get(2)); // bob
//        chatRoot.setCreatedAt(now.minusDays(15));
//        chatRoot = messageRepository.save(chatRoot);
//
//        // Create a 15-level casual conversation
//        Message chatParent = chatRoot;
//        for (int i = 1; i <= 15; i++) {
//            Message chatReply = new Message();
//            chatReply.setContent("Weekend chat " + i + ": " + getWeekendContent(i));
//            chatReply.setUser(users.get(i % users.size()));
//            chatReply.setParent(chatParent);
//            chatReply.setCreatedAt(now.minusDays(15).plusHours((long) i * 2));
//            chatParent = messageRepository.save(chatReply);
//        }
//
//        // Recent quick exchanges
//        createRecentQuickExchanges(users, now);
//    }
//
//    private String getTechContent(int level) {
//        String[] techTopics = {
//            "Microservices offer better scalability",
//            "But they increase complexity",
//            "Docker containers help with deployment",
//            "Kubernetes orchestration is essential",
//            "Service mesh provides communication layer",
//            "API gateways manage external access",
//            "Circuit breakers prevent cascade failures",
//            "Distributed tracing is crucial for debugging",
//            "Event-driven architecture improves decoupling",
//            "CQRS pattern separates read and write operations",
//            "Eventual consistency is a trade-off",
//            "Database per service principle",
//            "Saga pattern handles distributed transactions",
//            "Monitoring and observability are key",
//            "Security becomes more complex",
//            "Team autonomy increases with microservices",
//            "DevOps practices are mandatory",
//            "Infrastructure as code is important",
//            "Container orchestration skills needed",
//            "Culture change is the biggest challenge"
//        };
//        return techTopics[(level - 1) % techTopics.length];
//    }
//
//    private String getWeekendContent(int level) {
//        String[] weekendTopics = {
//            "Planning to visit the park",
//            "Maybe catch a movie tonight",
//            "Working on a personal coding project",
//            "Reading a new tech book",
//            "Going hiking with friends",
//            "Trying out a new restaurant",
//            "Binge-watching a series",
//            "Learning a new programming language",
//            "Playing video games",
//            "Visiting family",
//            "Attending a tech meetup",
//            "Exploring the city",
//            "Relaxing at home",
//            "Cooking something special",
//            "Sounds like a great plan!"
//        };
//        return weekendTopics[(level - 1) % weekendTopics.length];
//    }
//
//    private void createRecentQuickExchanges(List<User> users, LocalDateTime now) {
//        // Create some recent standalone messages
//        Message recent1 = new Message();
//        recent1.setContent("Has anyone tried the new React 18 features?");
//        recent1.setUser(users.get(1)); // alice
//        recent1.setCreatedAt(now.minusDays(3));
//        messageRepository.save(recent1);
//
//        Message recent2 = new Message();
//        recent2.setContent("Looking for recommendations on system design books.");
//        recent2.setUser(users.get(3)); // charlie
//        recent2.setCreatedAt(now.minusDays(2));
//        messageRepository.save(recent2);
//
//        Message recent3 = new Message();
//        recent3.setContent("Spring Boot 3.0 migration experience anyone?");
//        recent3.setUser(users.get(4)); // diana
//        recent3.setCreatedAt(now.minusDays(1));
//        messageRepository.save(recent3);
//
//        log.info("Created additional conversation threads and recent messages");
//    }
//}
