pragma circom 2.0.0; 


include "../../circomlib/circuits/comparators.circom";

template AgeConstraint() {
    // private
    signal input userAge; 
    
    // public
    signal input ageConstraint;


    // true/false
    signal output out;

    // considering max userAge 127
    component greaterEqThan = GreaterEqThan(8); 
    greaterEqThan.in[0] <== userAge;
    greaterEqThan.in[1] <== ageConstraint;

    out <-- greaterEqThan.out;
    out === 1;
}

component main {public [ageConstraint]} = AgeConstraint();