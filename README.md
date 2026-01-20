# AI-Driven Space Invaders

A modern reimagining of the classic Space Invaders game with adaptive enemy AI.  
Instead of fixed alien movement patterns, the invaders analyze player behavior in real time and adjust their strategy dynamically.

---

## 🎮 Gameplay

- Move the player ship using **Left** and **Right Arrow Keys**
- Shoot bullets using the **Spacebar**
- Aliens descend in waves and shoot back
- Survive until the timer ends to win
- If an alien reaches the ground or the player is hit — game over
- Press **R** to restart after game ends

---

## 🤖 AI Feature

The key innovation in this project is the **adaptive enemy AI system**.

## AI Approach:

Lightweight rule-based behavior modeling
Real-time telemetry collection
Periodic decision cycles
Adaptive formation control
Difficulty scaling per wave

### How it works:

- The game continuously tracks the player’s position zones (left, center, right)
- Every few seconds, the AI analyzes player movement statistics
- Based on the dominant player zone, the alien formation subtly repositions to avoid the player's main firing lane
- This creates a dynamic and reactive challenge instead of predictable enemy behavior

### Why it matters:

Classic Space Invaders has fixed movement patterns.  
This version introduces **behavior-based adaptation**, making each playthrough different.

---

## 🧠 Additional Game Mechanics

- Wave-based progression with increasing alien rows
- Timer-based survival win condition
- Alien bullets and collision detection
- Smooth simultaneous movement and firing controls
- Clean win / lose end screens with restart option

---

## 🛠️ Tech Stack

- HTML5 Canvas
- JavaScript
- CSS
- Basic behavioral AI logic

---

## 🚀 How to Run

1. Clone this repository
2. Open `index.html` in a browser
3. Play the game

No external libraries required.

---

## 🎥 Demo Video

Demo video explaining gameplay and AI logic:  
(Insert your Google Drive video link here)

---

## 📁 Project Structure

