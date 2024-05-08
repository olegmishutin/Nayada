import random
from django.db.models import Manager


class OrderManager(Manager):
    def create(self, **kwargs):
        instance = super(OrderManager, self).create(**kwargs)
        instance.identification_number = random.randint(1000000000, 9999999999)
        instance.save(update_fields=['identification_number'])
        return instance
