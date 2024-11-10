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
                            env.TEST_URL = "http://host.docker.internal:5000"
                            env.GITHUB_TOKEN = envVars.find { it.startsWith('GITHUB_TOKEN=') }?.split('=')[1]
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
                    echo "TEST_URL=$TEST_URL"
                    make run
                '''
            }
        }
        stage('Run Unit Tests') {
            steps {
                // Usa el objetivo `Compra_test` del Makefile para ejecutar las pruebas unitarias
                sh '''
                    echo "Waiting for server to start..."
                    for i in {1..10}; do
                        nc -z localhost 5000 && break
                        echo "Waiting for localhost:5000..."
                        sleep 5
                    done
                    make Compra_test
                '''
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo 'Merging develop into main...'

                    sh '''
                        git config user.email "sebatian.arrieta@usm.cl"
                        git config user.name "SebasArrieta"
                       
                        git checkout main

                        git pull origin main --rebase
                      
                        git merge develop -m "Merging develop into main via Jenkins pipeline" --allow-unrelated-histories -X theirs

                        echo "AWS_ACCESS_KEY_ID=$GITHUB_TOKEN"

                        # Check for merge conflict
                        if [[ -n "$(git ls-files -u)" ]]; then
                            echo "Merge conflict detected. Resolving automatically..."
                            git merge --abort
                            git checkout --theirs .
                            git add .
                            git commit -m "Resolved merge conflict in Jenkins pipeline"
                        fi

                        git push https://${GITHUB_TOKEN}@github.com/INF331-Equipo9/Proyecto-ModaVirtualNeonThreads.git main
                    '''

                    echo 'Merge completed successfully!'
                }
            }
        }
    }
    post {
        always {
            sh 'docker compose down'
        }
        success {
            echo 'Despliegue y pruebas exitosas'
        }
        failure {
            echo 'Pipeline fallido, el despliegue no se realizó'
        }
    }
}
