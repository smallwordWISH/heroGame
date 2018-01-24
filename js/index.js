class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }

  getHurt(damage) {
    this.hp -= damage;
    if(this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
    var _this = this;
    var i = 0;
    
    var id = setInterval(function(){
      if (i == 0) {
        _this.effectElement.css('display', 'block');
        _this.textElement.css('color', 'red')   
        _this.textElement.addClass('attacked');
        _this.textElement.text(damage);
      }
      _this.effectElement.attr('src', attackImgs[i].src);
      i++;
      if (i > 7) {
        _this.effectElement.css('display', 'none');
        _this.textElement.removeClass('attacked');
        _this.textElement.text('');
        clearInterval(id);
      }
    }, 50);
  }

  die() {
    this.alive = false;
  }

  updateHtml(hpElement, hurtElement) {
    hpElement.text(this.hp);
    var width = (100 - (this.hp/this.maxHp)*100) + '%';
    hurtElement.css('width', width); 
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    this.element = $('#hero-image-block');
    this.hpElement = $('#hero-hp');
    this.maxHpElement = $('#hero-max-hp');
    this.hurtElement = $('#hero-hp-hurt');
    this.effectElement = $('#hero-image-block .effect-image');
    this.textElement = $('#hero-image-block .hurt-text');

    this.hpElement.text(this.hp);
    this.maxHpElement.text(this.maxHp);
  }

  attack(character) {
    var damage = Math.random() * (this.ap/2) + (this.ap/2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);     
  }

  heal() {
    this.hp += 40;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
    this.updateHtml(this.hpElement, this.hurtElement);
    
    var _this = this;
    var i = 0;
    
    var id = setInterval(function(){
      if (i == 0) {
        _this.effectElement.css('display', 'block');
        _this.textElement.css('color', '#068338')  
        _this.textElement.addClass('attacked');
        _this.textElement.text('40');
      }
      _this.effectElement.attr('src', healImgs[i].src);
      i++;
      if (i > 7) {
        _this.effectElement.css('display', 'none');
        _this.textElement.removeClass('attacked');
        _this.textElement.text('');
        clearInterval(id);
      }
    }, 50);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    this.element = $('#monster-image-block');
    this.hpElement = $('#monster-hp');
    this.maxHpElement = $('#monster-max-hp');
    this.hurtElement = $('#monster-hp-hurt');
    this.effectElement = $('#monster-image-block .effect-image');
    this.textElement = $('#monster-image-block .hurt-text');

    this.hpElement.text(this.hp);
    this.maxHpElement.text(this.maxHp);
  }

  attack(character) {
    var damage = Math.random() * (this.ap/2) + (this.ap/2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero('Word', 130, 30);
var monster = new Monster('Skeleton', 130, 35);
var rounds = 10;
var attackImgs = [];
for (var i = 0 ; i < 8; i++) {
  attackImgs[i] = new Image();
  attackImgs[i].src = 'images/effect/blade/' + (i+1) + '.png';
}
var healImgs = [];
for (var i = 0 ; i < 8; i++) {
  healImgs[i] = new Image();
  healImgs[i].src = 'images/effect/heal/' + (i+1) + '.png';
}
var fired = false;

function endTurn() {
  rounds--;
  $('#round-num').text(rounds);
  if (rounds < 1) {
    $('#dialog').css('display', 'block');
    $('#dialog').addClass('lose');
    $('#dialog .lose-dialog h2').text('未能擊敗...');
  }
}

$(function(){
  $('#skill').on('click', function(){
    heroAttack();
    monsterAttack();
  });

  $('#heal').on('click', function(){
    heroHeal();
    monsterAttack();
  })

  $(document).keydown(function(e) {
      if(e.which == 65 && !fired) {
        fired = true;
        if (fired) {
          heroAttack();
          monsterAttack();
        }
      } else if (e.which == 68 && !fired) {
        fired = true; 
        if (fired) {
          heroHeal();
          monsterAttack();
        } 
      }
  });
})

function heroAttack() {
  $('.skill-block').css('display', 'none');

  setTimeout(function(){
    hero.element.addClass('attacking');
    setTimeout(function(){
      hero.attack(monster);
      hero.element.removeClass('attacking');
    }, 500)
  }, 100);
}

function monsterAttack() {
  setTimeout(function(){
    if (monster.alive) {
      monster.element.addClass('attacking');
      setTimeout(function(){
        monster.attack(hero);
        monster.element.removeClass('attacking');
        endTurn();
        if (!hero.alive) {
          $('#dialog').css('display', 'block');
          $('#dialog').addClass('lose');
        } else {
          setTimeout(function(){
            $('.skill-block').css('display', 'block');
            fired = false;
          }, 600);
        }
      }, 500) 
    } else {
      $('#dialog').css('display', 'block');
      $('#dialog').addClass('win');
    }
  },1100)
}

function heroHeal() {
  $('.skill-block').css('display', 'none');
  hero.heal();
}