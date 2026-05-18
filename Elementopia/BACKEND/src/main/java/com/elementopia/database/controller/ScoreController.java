package com.elementopia.database.controller;

import com.elementopia.database.dto.ScoreDTO;
import com.elementopia.database.entity.ScoreEntity;
import com.elementopia.database.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/score")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    /** Create a score record for a user */
    @PostMapping("/create/{userId}")
    public ResponseEntity<ScoreEntity> createScore(@PathVariable Long userId) {
        return ResponseEntity.ok(scoreService.createScore(userId));
    }

    /** Get score by userId */
    @GetMapping("/{userId}")
    public ResponseEntity<ScoreEntity> getScore(@PathVariable Long userId) {
        return ResponseEntity.ok(scoreService.getByUserId(userId));
    }

    /** Get all scores */
    @GetMapping("/all")
    public ResponseEntity<List<ScoreEntity>> getAllScores() {
        return ResponseEntity.ok(scoreService.getAllScores());
    }

    /** Replace a user's score using ScoreDTO */
    @PutMapping("/update/{userId}")
    public ResponseEntity<ScoreEntity> updateScoreWithLesson(
            @PathVariable Long userId,
            @RequestBody ScoreDTO request
    ) {
        return ResponseEntity.ok(scoreService.updateScoreWithLesson(userId, request));
    }

    /** Increment score using ScoreDTO */
    @PostMapping("/add/{userId}")
    public ResponseEntity<ScoreEntity> addScore(
            @PathVariable Long userId,
            @RequestBody ScoreDTO request
    ) {
        return ResponseEntity.ok(scoreService.addScore(userId, request.getScore()));
    }

    /** Delete score record */
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteScore(@PathVariable Long userId) {
        scoreService.deleteScore(userId);
        return ResponseEntity.ok("Score deleted successfully");
    }
}
