package org.example.recipe_match_backend.domain.recipe.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.recipe_match_backend.domain.recipe.dto.request.RecipeRequest;
import org.example.recipe_match_backend.domain.recipe.dto.request.RecipeUpdateRequest;
import org.example.recipe_match_backend.domain.recipe.dto.response.RecipeResponse;
import org.example.recipe_match_backend.domain.recipe.service.RecipeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping("/recipe")
    public RecipeResponse find(@RequestParam Long recipeId){
        return recipeService.find(recipeId);
    }

    @GetMapping("/recipeAll")
    public List<RecipeResponse> findAll(){
        return recipeService.findAll();
    }

    @PostMapping("/recipe")
    public void create(@ModelAttribute RecipeRequest recipeRequest, HttpServletRequest request){
        HttpSession session = request.getSession(false);
        Long userId = (Long)session.getAttribute("userId");
        recipeService.save(recipeRequest,userId);
    }

    @PatchMapping("/recipe")
    public void update(@RequestParam Long recipeId, @ModelAttribute RecipeUpdateRequest recipeUpdateRequest){
        recipeService.update(recipeId, recipeUpdateRequest);
    }

    @DeleteMapping("/recipe")
    public void delete(@RequestParam Long recipeId){
        recipeService.delete(recipeId);
    }
}
