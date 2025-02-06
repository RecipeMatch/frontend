package org.example.recipe_match_backend.domain.recipe.repository;

import org.example.recipe_match_backend.domain.recipe.domain.RecipeTool;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeToolRepository extends JpaRepository<RecipeTool,Long> {
}
