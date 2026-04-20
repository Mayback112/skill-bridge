plugins {
    java
    id("org.springframework.boot") version "3.4.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.skillbridge"
version = "0.0.1-SNAPSHOT"
description = "skill-bridge"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

val jjwtVersion = "0.12.6"
val mapstructVersion = "1.6.3"
val pdfboxVersion = "3.0.3"

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // PostgreSQL
    runtimeOnly("org.postgresql:postgresql")

    // Flyway
    implementation("org.flywaydb:flyway-core")
    runtimeOnly("org.flywaydb:flyway-database-postgresql")

    // JWT (JJWT 0.12.x)
    implementation("io.jsonwebtoken:jjwt-api:$jjwtVersion")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:$jjwtVersion")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:$jjwtVersion")

    // Apache PDFBox
    implementation("org.apache.pdfbox:pdfbox:$pdfboxVersion")

    // Lombok (must come before MapStruct in annotation processing)
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // MapStruct
    implementation("org.mapstruct:mapstruct:$mapstructVersion")
    annotationProcessor("org.projectlombok:lombok-mapstruct-binding:0.2.0")
    annotationProcessor("org.mapstruct:mapstruct-processor:$mapstructVersion")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

val frontendDir = "$projectDir/skill-bridge-frontend"

val cleanFrontend by tasks.registering(Delete::class) {
    group = "build"
    description = "Cleans frontend build artifacts and node_modules"
    delete("$frontendDir/dist")
    delete("$frontendDir/node_modules")
    delete("src/main/resources/static")
}

tasks.clean {
    dependsOn(cleanFrontend)
}

val installFrontend by tasks.registering(Exec::class) {
    group = "build"
    description = "Installs frontend dependencies"
    workingDir = file(frontendDir)
    commandLine(if (org.apache.tools.ant.taskdefs.condition.Os.isFamily(org.apache.tools.ant.taskdefs.condition.Os.FAMILY_WINDOWS)) "npm.cmd" else "npm", "install")
    inputs.file(file("$frontendDir/package.json"))
    outputs.dir(file("$frontendDir/node_modules"))
}

val buildFrontend by tasks.registering(Exec::class) {
    group = "build"
    description = "Builds the frontend"
    dependsOn(installFrontend)
    workingDir = file(frontendDir)
    commandLine(if (org.apache.tools.ant.taskdefs.condition.Os.isFamily(org.apache.tools.ant.taskdefs.condition.Os.FAMILY_WINDOWS)) "npm.cmd" else "npm", "run", "build")
    inputs.dir(file("$frontendDir/src"))
    inputs.dir(file("$frontendDir/public"))
    inputs.file(file("$frontendDir/package.json"))
    outputs.dir(file("$frontendDir/dist"))
}

val copyFrontendToStatic by tasks.registering(Copy::class) {
    group = "build"
    description = "Copies the frontend build to the static resources directory"
    dependsOn(buildFrontend)
    
    // Clean the destination directory before copying
    doFirst {
        delete("src/main/resources/static")
    }
    
    from("$frontendDir/dist")
    into("src/main/resources/static")
}

tasks.bootRun {
    dependsOn(copyFrontendToStatic)
}

tasks.processResources {
    dependsOn(copyFrontendToStatic)
}
