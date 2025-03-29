import Mathlib.Data.Real.Basic

/-
Il faut importer la bibliothèque précédente sinon
l'exemple donné en introduction ne fonctionne pas
Essai Latex : $x^2$
-/

-- 1. Introduction

-- An example.
example (a b c : ℝ) : a * b * c = b * (a * c) := by
  rw [mul_comm a b]
  rw [mul_assoc b a c]

-- 2. Dependent type theory

-- Des exemples d'essais de types
-- Le mot clé **#check** retourne le type
#check true -- Bool

-- Autre manière de faire la même chose
-- Découverte du mot clé **def**
def logic: Bool := true
#check logic

-- Une autre série d'essais de type
#check Nat → Nat   -- Type
#check ℕ×ℕ         -- Type
def n:Nat :=1
#check Nat.add 3 n -- Nat

-- Le mot clé **#eval** évalue l'expression
#eval Nat.add 3 n  -- 4


def α : Type := Nat
def β : Type := Bool
def F : Type → Type := List
def G : Type → Type → Type := Prod

#eval max 1 2

#check α        -- Type
#check F α      -- Type
#check F Nat    -- Type
#check G α      -- Type → Type
#check G α β    -- Type
#check G α Nat  -- Type

#check List

def mon_prod := (1,2)
def ma_mist: Prod Nat Nat := (1,2)

#check true
#check Bool
#check trivial

#check Prop
#check Sort

#check List

def f: Nat→ Nat:= fun x=>x+1
def g:=fun x:Nat=>x+1

#eval f 5

def h:= λ x:Nat => x+1

def fon (n : Nat) : String := toString n

#eval fon 3

def fon2 : Nat → String := fun n => toString n

#eval fon2 3

def foo := let a := Nat; fun x : a => x + 2

-- def bar := (fun a => fun x : a => x + 2) Nat

section
variable (α β γ : Type)
variable (g : β → γ) (f : α → β) (h : α → α)
variable (x : α)

def compose := g (f x)
end


#print compose

def ma_list: List Nat:= [1,2,3]

#eval ma_list[1]

def mo_prod:=(4,7,9)

#eval mo_prod.1

namespace essai1

  def f: Bool → Nat → Nat:= fun tf x => if tf then x+1 else x*x

  #check f

end essai1

namespace essai2

  universe u v

  def f (α : Type u) (β : α → Type v) (a : α) (b : β a) : (a : α) × β a :=
    ⟨a, b⟩

end essai2

namespace essai3

  universe u
  def Lst (α : Type u) : Type u := List α
  def Lst.cons (α : Type u) (a : α) (as : Lst α) : Lst α := List.cons a as
  def Lst.nil (α : Type u) : Lst α := List.nil
  def Lst.append (α : Type u) (as bs : Lst α) : Lst α := List.append as bs

  def as : Lst Nat := Lst.nil Nat


end essai3

namespace my_proof

  def Implies (p q : Prop) : Prop := p → q

  #eval true → true

  #check Implies true true

  #eval And true true

  structure Proof (p : Prop) : Type where
    proof : p

  axiom and_comm (p q : Prop) : Proof (Implies (And p q) (And q p))



  axiom modus_ponens : (p q : Prop) → Proof (Implies p q) → Proof p → Proof q

end my_proof

namespace my_proof2



end my_proof2
