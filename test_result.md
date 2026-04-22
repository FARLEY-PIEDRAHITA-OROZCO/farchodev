#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Farley Piedrahita Orozco — portafolio 3D interactivo (QA + Cybersecurity Jr).
  Backend scope: persistir mensajes de contacto y contador de visitas.

backend:
  - task: "POST /api/contact — create contact message"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Endpoint creates a message with uuid + created_at, stored in MongoDB collection `contact_messages`. Validates name (1..100), email (EmailStr), subject (optional, max 200), message (1..5000). Returns 201 with the created message."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: POST /api/contact working correctly. Valid payload returns 201 with all required fields (id, name, email, subject, message, created_at). All validation tests passed: missing name/email/message (422), invalid email (422), name >100 chars (422), message >5000 chars (422)."

  - task: "GET /api/contact — list contact messages"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Paginated list with `limit` (1..200, default 50) and `skip` (>=0). Returns {total, items[]} sorted by created_at desc."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: GET /api/contact working correctly. Returns {total, items[]} structure. Created messages appear in list sorted by created_at desc. Pagination tested with limit=1, skip=0 and skip=1 - working correctly."

  - task: "GET /api/stats/ping — increment visit counter"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Upserts document _id='visits' in `stats` collection, increments count by 1 and returns {visits:int}."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: GET /api/stats/ping working correctly. Counter increments properly on successive calls (tested visits: 1 → 2). Returns {visits: int} format as expected."

  - task: "GET /api/health — DB ping"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Pings MongoDB and returns status."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: GET /api/health working correctly. Returns {status: 'ok', db: 'connected'} as expected. MongoDB connection verified."

frontend:
  - task: "Contact form submits to /api/contact"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/Contact.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Now posts to REACT_APP_BACKEND_URL/api/contact. Falls back to localStorage if request fails. Will be tested by user manually unless requested."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "POST /api/contact — create contact message"
    - "GET /api/contact — list contact messages"
    - "GET /api/stats/ping — increment visit counter"
    - "GET /api/health — DB ping"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        Implemented 4 backend endpoints for Farley's portfolio:
          1) POST /api/contact (create) — pydantic-validated (EmailStr, length limits), stores uuid+created_at in Mongo.
          2) GET /api/contact (list, paginated) — returns total + items sorted desc.
          3) GET /api/stats/ping — upsert/increment visits counter.
          4) GET /api/health — mongo ping.
        Please test these endpoints focusing on:
          - Happy path (valid payload)
          - Validation errors (missing name/email/message, invalid email, oversized message)
          - Pagination (limit/skip combinations) for GET /api/contact
          - That visits counter actually increments across successive calls.
        Use REACT_APP_BACKEND_URL as base; prefix with /api for all routes.
    - agent: "testing"
      message: |
        ✅ BACKEND TESTING COMPLETE - ALL ENDPOINTS WORKING
        Tested all 4 backend endpoints using base URL: https://qa-3d-portfolio.preview.emergentagent.com/api
        
        Results:
        1) POST /api/contact ✅ - Valid payloads return 201 with correct structure (id, name, email, subject, message, created_at). All validation working: missing fields (422), invalid email (422), oversized fields (422).
        2) GET /api/contact ✅ - Returns {total, items[]} sorted by created_at desc. Pagination tested and working (limit=1, skip=0/1).
        3) GET /api/stats/ping ✅ - Counter increments correctly on successive calls (1→2). Returns {visits: int}.
        4) GET /api/health ✅ - Returns {status: 'ok', db: 'connected'}. MongoDB connection verified.
        
        All backend functionality is working correctly. No issues found.
