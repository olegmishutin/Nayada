import random
from django.db.models import Manager


class OrderManager(Manager):
    def create(self, **kwargs):
        order = super(OrderManager, self).create(**kwargs)
        order.identification_number = random.randint(1000000000, 9999999999)
        order.save(update_fields=['identification_number'])
        return order
