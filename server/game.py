import random
import time
class Field:
    def __init__(self, x=3000, y=3000):
        self.__size = (x, y)


    def __get_size(self):
        return self.__size


    def __set_size(self, x, y):
        self.__size = (x, y)

    size = property(fget=__get_size, fset=__set_size)

class GameObject:
    def __init__(self, x, y, id=0):
        self.__x = x
        self.__y = y
        self.__id = id

    def __get_pos(self):
        return [self.__x, self.__y]


    def __set_pos(self, coords):
        self.__x = coords[0]
        self.__y = coords[1]
    

    def __get_x(self):
        return self.__x
    

    def __set_x(self, x):
        self.__x = x


    def __get_y(self):
        return self.__y

    def __set_y(self, y):
        self.__y = y   

    def __get_id(self):
        return self.__id

    def __set_id(self, id):
        self.__id = id

    pos = property(fget=__get_pos, fset=__set_pos)
    x = property(fget=__get_x, fset=__set_x)
    y = property(fget=__get_y, fset=__set_y)
    id = property(fget=__get_id, fset=__set_id)

class Player(GameObject):
    MAX_HEALTH = 2000
    MAX_DAMAGE = 150
    def __init__(self, x, y, hp = 10, dmg = 1, id=0):
        super().__init__(x, y, id)
        self.__hp = hp
        self.__dmg = dmg

    def __get_id(self):
        return self.__id

    def __get_hp(self):
        return self.__hp
    

    def __set_hp(self, hp):
        self.__hp = hp
    

    def __get_dmg(self):
        return self.__dmg
    

    def __set_dmg(self, dmg):
        self.__dmg = dmg    

    dmg = property(fget=__get_dmg, fset=__set_dmg)
    hp = property(fget=__get_hp, fset=__set_hp)

class Bullet(GameObject):
    def __init__(self, x, y, dmg, id = 0):
        super().__init__(x, y, id=0)
        self.__dmg = dmg
    
    def __get_dmg(self):
        return self.__dmg

    def __set_dmg(self, dmg):
        self.__dmg = dmg
    
    dmg = property(fget=__get_dmg, fset=__set_dmg)

class Trash(GameObject):
    def __init__(self, x, y, id=0):
        super().__init__(x, y, id)


class Room:
    updateSetTemplate = {'players': [], 'bullets': [], 'trash': []}
    cur_id = 0
    def __init__(self):
        self.id = Room.cur_id
        Room.cur_id+=1
        self.__curPlayerID = 1
        self.__curBulletID = 1
        self.__curTrashID = 1
        self.__players = []
        self.__bullets = []
        self.__trash = []
        self.__generated = Room.updateSetTemplate.copy()
        self.__updated = Room.updateSetTemplate.copy()
        self.__deleted = Room.updateSetTemplate.copy()

    def update(self):
        self.__generated['trash'].clear()
        x, y = random.randint(-800, 800), random.randint(-800, 800)
        id = self.__curTrashID
        self.__trash.append(Trash(x, y, id))
        self.__curTrashID+=1   
        self.__generated['trash'].append({'id': id, 'x': x, 'y': y})
    
    def add_player(self):
        self.__players.append(Player(random.randint(-500, 500), random.randint(-500, 500)))
    
    def remove_player(self, player_id):
        pass

    def getUpdateInfo(self):
        return self.__generated

    def getInfo(self):
        return [x.pos for x in self.trash]

    def __get_players(self):
        return self.__players

    def __get_bullets(self):
        return self.__bullets
    
    def __get_trash(self):
        return self.__trash
    
    players = property(fget=__get_players, fset=None)
    bullets = property(fget=__get_bullets, fset=None)
    trash = property(fget=__get_trash, fset=None)

class Game:
    def __init__(self, field: Field):
        pass

if __name__ == "__main__":
    r = Room()
    while True:
        time.sleep(0.5)
        r.update()
        print(r.getUpdateInfo())
        print([x.pos for x in r.trash])
