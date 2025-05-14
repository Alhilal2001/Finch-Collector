from django.test import TestCase
from django.contrib.auth.models import User
from main_app.models import Finch, Toy, Feeding, Photo
from datetime import date

class ModelsTest(TestCase):
    def setUp(self):
        # user;
        self.user = User.objects.create_user(username='testuser', password='12345')
        # toys;
        self.toy1 = Toy.objects.create(name='Mouse',   color='Gray')
        self.toy2 = Toy.objects.create(name='Ball',    color='Red')
        self.toy3 = Toy.objects.create(name='Feather', color='white')
        # finch; each related to user
        self.finch1 = Finch.objects.create(name='Felix',   breed='Tabby', description='Playful finch',   age=3, user=self.user)
        self.finch2 = Finch.objects.create(name='Whiskers',breed='Tabby', description='A playful finch.',age=5, user=self.user)
        # feeding; two related to finch1
        self.feeding1 = Feeding.objects.create(date=date(2025, 1, 1), meal='B', finch=self.finch1)
        self.feeding2 = Feeding.objects.create(date=date(2024, 1, 1), meal='L', finch=self.finch1)
        self.feeding3 = Feeding.objects.create(date=date(2023, 1, 1), meal='D', finch=self.finch2)
        # photo; each related to one finch
        self.photo1 = Photo.objects.create(finch=self.finch1, url='http://url1.com', title='First')
        self.photo2 = Photo.objects.create(finch=self.finch2, url='http://url2.com', title='First')
        # relate toy1 and toy2 to finch
        self.finch1.toys.set([self.toy1, self.toy2])

    # -------------------
    # String Representations / creation (using __str__ to ensure property return)
    # -------------------
    def test_user_create(self):
        self.assertEqual(str(self.user), 'testuser')
    
    def test_finch_create(self):
        self.assertEqual(str(self.finch1), 'Felix')
        self.assertEqual(str(self.finch2), 'Whiskers')

    def test_toy_create(self):
        self.assertEqual(str(self.toy1), 'Mouse')
        self.assertEqual(str(self.toy2), 'Ball')
        self.assertEqual(str(self.toy3), 'Feather')

    def test_feeding_create(self):
        self.assertEqual(str(self.feeding1), 'B')
        self.assertEqual(str(self.feeding2), 'L')
        self.assertEqual(str(self.feeding3), 'D')

    def test_photo_create(self):
        self.assertEqual(str(self.photo1), 'http://url1.com')
        self.assertEqual(str(self.photo2), 'http://url2.com')

    def test_user_create(self):
        self.assertEqual(str(self.user), 'testuser')

    # -------------------
    # Relationships
    # -------------------
    
    def test_finch_toys_relationship(self):
        self.assertEqual(self.finch1.toys.count(), 2)
        self.assertIn(self.toy1, self.finch1.toys.all())
        self.assertIn(self.toy2, self.finch1.toys.all())

    def test_finch_user_relationship(self):
        self.assertEqual(self.finch1.user.username, 'testuser')

    def test_finch_feeding_relationship(self):
        self.assertEqual(self.feeding1.finch, self.finch1)
        self.assertEqual(self.feeding1.meal, 'B')
        self.assertEqual(self.feeding2.finch, self.finch1)
        self.assertEqual(self.feeding2.meal, 'L')
        self.assertEqual(self.feeding3.finch, self.finch2)
        self.assertEqual(self.feeding3.meal, 'D')

    def test_finch_photo_relationship(self):
        self.assertEqual(self.photo1.finch, self.finch1)
        self.assertEqual(self.photo2.finch, self.finch2)

    # -------------------
    # Model Methods / Ordering
    # -------------------
    
    def test_feeding_ordering(self):
        # check finch1 feedings in order
        feedings = Feeding.objects.filter(finch=self.finch1.id)
        self.assertEqual(feedings[0].date, date(2025, 1, 1))
        self.assertEqual(feedings[1].date, date(2024, 1, 1))

        # check all feedings
        all_feedings = Feeding.objects.all()
        self.assertEqual(all_feedings[0].date, date(2025, 1, 1))
        self.assertEqual(all_feedings[1].date, date(2024, 1, 1))
        self.assertEqual(all_feedings[2].date, date(2023, 1, 1))

    # -------------------
    # Cascade Deletions
    # -------------------
    
    # 1 user, two related finchs => 0 finchs left after delete
    def test_deleting_user_cascades_to_finch(self):
        self.user.delete()
        self.assertEqual(Finch.objects.count(), 0)

    # finch2 had ONE feeding => should still be two in database related to finch1!
    def test_deleting_finch_cascades_to_feedings(self):
        self.finch2.delete()
        self.assertEqual(Feeding.objects.count(), 2)

    # finch1 had one photo out of two => 1 left over!
    def test_deleting_finch_cascades_to_photo(self):
        self.finch1.delete()
        self.assertEqual(Photo.objects.count(), 1)
