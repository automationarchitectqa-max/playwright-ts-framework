// Jenkinsfile
// ─────────────────────────────────────────────────────────────────────────────
// Pipeline for PW-TS Framework
// Parameters:
//   ENV     — target environment (dev / staging / prod)
//   TAG     — test tag filter (@smoke / @regression / @api / @ui / @e2e)
//   WORKERS — number of parallel workers
//   PROJECT — playwright project (api / ui / e2e / all)
//   BROWSER — browser to use for UI tests (chromium / firefox / webkit)
// ─────────────────────────────────────────────────────────────────────────────

pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.60.0-noble'
            args '--ipc=host'
        }
    }

    parameters {
        choice(
            name: 'ENV',
            choices: ['dev', 'staging', 'prod'],
            description: 'Target environment'
        )
        string(
            name: 'TAG',
            defaultValue: 'smoke',
            description: 'Tag filter: smoke | regression | api | ui | e2e | (leave empty for all)'
        )
        string(
            name: 'WORKERS',
            defaultValue: '4',
            description: 'Number of parallel workers'
        )
        choice(
            name: 'PROJECT',
            choices: ['all', 'api', 'ui', 'e2e'],
            description: 'Test project to run'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run browser in headless mode'
        )
        booleanParam(
            name: 'GENERATE_ALLURE',
            defaultValue: true,
            description: 'Generate Allure report after run'
        )
    }

    environment {
        ENV         = "${params.ENV}"
        TAG         = "${params.TAG}"
        WORKERS     = "${params.WORKERS}"
        HEADLESS    = "${params.HEADLESS}"
        CI          = "true"
        NODE_ENV    = "test"
    }

    options {
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium firefox webkit'
            }
        }

        stage('TypeCheck') {
            steps {
                sh 'npm run typecheck'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def projectFlag = params.PROJECT == 'all' ? '' : "--project=${params.PROJECT}"
                    def tagFlag = params.TAG ? "--grep @${params.TAG}" : ''

                    sh """
                        npx playwright test \
                          ${projectFlag} \
                          ${tagFlag} \
                          --workers=${params.WORKERS} \
                          --reporter=list,html,junit,allure-playwright
                    """
                }
            }
            post {
                always {
                    // Archive JUnit XML for Jenkins test results
                    junit 'reports/junit/results.xml'
                }
            }
        }

        stage('Generate Allure Report') {
            when {
                expression { params.GENERATE_ALLURE == true }
            }
            steps {
                sh 'npx allure generate reports/allure-results -o reports/allure-report --clean'
            }
        }

        stage('Publish Reports') {
            steps {
                // Publish HTML report
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/html',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])

                // Publish Allure report (requires Allure Jenkins plugin)
                allure([
                    includeProperties: false,
                    jdk: '',
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'reports/allure-results']]
                ])
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*', fingerprint: true, allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo "✅ Test run completed successfully on ${params.ENV}"
        }
        failure {
            echo "❌ Test run failed on ${params.ENV} — check reports for details"
        }
    }
}
