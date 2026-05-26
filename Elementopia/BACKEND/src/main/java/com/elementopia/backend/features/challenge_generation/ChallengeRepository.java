package com.elementopia.backend.features.challenge_generation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ChallengeRepository {

    private final JdbcTemplate jdbcTemplate;

    public ChallengeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Challenge> findByDomainAndGrade(int domainId, String gradeLevel) {
        // Query your physical SDD table schema verbatim from Supabase
        String sql = "SELECT reaction_id, domain_id, compound_formula, compound_name " +
                "FROM PREDEFINED_REACTION_POOL " +
                "WHERE domain_id = ? AND curriculum_grade_level = ?";

        // Maps the SQL database results directly into our clean, non-entity Challenge memory class
        return jdbcTemplate.query(sql, (rs, rowNum) -> new Challenge(
                rs.getInt("reaction_id"),
                rs.getInt("domain_id"),
                rs.getString("compound_formula"),
                rs.getString("compound_name"),
                // Raw elements list can be mapped out or looked up asynchronously by your service layer
                List.of()
        ), domainId, gradeLevel);
    }
}