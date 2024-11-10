pipeline {
    agent any
    stages {
        stage('Use Environment Variables') {
            steps {
                script {
                    def envFile = '/var/jenkins_home/.env'
                    if (fileExists(envFile)) {
                        echo "Sourcing .env file..."
                        def envVars = readFile(envFile).split('\n').collect { line ->
                            if (line.contains('=')) {
                                return line.trim()
                            }
                        }.findAll { it }
                        echo "Environment Variables Loaded:"
                        envVars.each { echo it }
                        withEnv(envVars) {
                            echo "Environment variables have been loaded."

                            // Set them globally so they are available across all pipeline stages
                            env.AWS_ACCESS_KEY_ID = envVars.find { it.startsWith('AWS_ACCESS_KEY_ID=') }?.split('=')[1]
                            env.AWS_SECRET_ACCESS_KEY = envVars.find { it.startsWith('AWS_SECRET_ACCESS_KEY=') }?.split('=')[1]
                            env.AWS_REGION = envVars.find { it.startsWith('AWS_REGION=') }?.split('=')[1]
                        }
                    } else {
                        error ".env file not found!"
                    }
                }
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'develop',
                    url: 'https://github.com/INF331-Equipo9/Proyecto-ModaVirtualNeonThreads.git',
                    credentialsId: 'github-pat'
            }
        }
        stage('Verify Workspace') {
            steps {
                sh 'pwd && ls -la'
            }
        }
        stage('Build and Run Application') {
            steps {
                sh '''
                    echo "Running make with the following environment variables:"
                    echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
                    echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
                    echo "AWS_REGION=$AWS_REGION"
                    make run
                '''
            }
        }
        stage('Run Unit Tests') {
            steps {
                // Usa el objetivo `Compra_test` del Makefile para ejecutar las pruebas unitarias
                sh 'make Compra_test'
            }
        }
        stage('Deploy') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Desplegando aplicación...'
                // Agrega el comando o script de despliegue aquí
            }
        }
    }
    post {
        always {
            echo 'Pipeline completado'
        }
        success {
            echo 'Despliegue y pruebas exitosas'
        }
        failure {
            echo 'Pipeline fallido, el despliegue no se realizó'
        }
    }
}
