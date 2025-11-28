import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Activity {
  id: number;
  category: string;
  title: string;
  points: number;
  date: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalPoints: number;
  activities: Activity[];
}

const Index = () => {
  const [totalPoints, setTotalPoints] = useState(1250);
  const [level, setLevel] = useState(5);
  const [progressToNextLevel, setProgressToNextLevel] = useState(62);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityPoints, setNewActivityPoints] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');

  const [categories, setCategories] = useState<Category[]>([
    { id: 'quality', name: 'Качество занятий', icon: 'Star', color: 'bg-primary', totalPoints: 320, activities: [] },
    { id: 'program', name: 'Парциальная программа', icon: 'BookOpen', color: 'bg-secondary', totalPoints: 180, activities: [] },
    { id: 'education', name: 'Самообразование', icon: 'GraduationCap', color: 'bg-accent', totalPoints: 240, activities: [] },
    { id: 'regional', name: 'Региональный компонент', icon: 'MapPin', color: 'bg-success', totalPoints: 150, activities: [] },
    { id: 'projects', name: 'Реализация проектов', icon: 'Lightbulb', color: 'bg-primary', totalPoints: 200, activities: [] },
    { id: 'teacher', name: 'Участие педагога', icon: 'UserCheck', color: 'bg-secondary', totalPoints: 90, activities: [] },
    { id: 'children', name: 'Участие детей', icon: 'Users', color: 'bg-accent', totalPoints: 50, activities: [] },
    { id: 'hr', name: 'Кадровая работа', icon: 'Briefcase', color: 'bg-success', totalPoints: 20, activities: [] },
  ]);

  const handleAddActivity = () => {
    if (!selectedCategory || !newActivityTitle || !newActivityPoints) {
      toast.error('Заполните все поля');
      return;
    }

    const points = parseInt(newActivityPoints);
    const newActivity: Activity = {
      id: Date.now(),
      category: selectedCategory.name,
      title: newActivityTitle,
      points: points,
      date: new Date().toLocaleDateString('ru-RU'),
      description: newActivityDescription,
    };

    setCategories(cats => cats.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          totalPoints: cat.totalPoints + points,
          activities: [...cat.activities, newActivity]
        };
      }
      return cat;
    }));

    setTotalPoints(prev => prev + points);
    
    const newProgress = progressToNextLevel + (points / 20);
    if (newProgress >= 100) {
      setLevel(prev => prev + 1);
      setProgressToNextLevel(newProgress - 100);
      toast.success(`Новый уровень! Вы достигли ${level + 1} уровня!`, {
        icon: '🎉',
      });
    } else {
      setProgressToNextLevel(newProgress);
    }

    toast.success(`+${points} баллов за "${newActivityTitle}"`, {
      icon: '⭐',
    });

    setNewActivityTitle('');
    setNewActivityPoints('');
    setNewActivityDescription('');
    setSelectedCategory(null);
  };

  const achievements = [
    { name: 'Первые шаги', icon: 'Award', unlocked: true },
    { name: 'Профессионал', icon: 'Trophy', unlocked: true },
    { name: 'Мастер', icon: 'Crown', unlocked: false },
    { name: 'Легенда', icon: 'Zap', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Портфолио Педагога
          </h1>
          <p className="text-muted-foreground text-lg">Копите баллы за вашу работу и достижения</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 animate-scale-in hover:shadow-xl transition-all duration-300 border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Icon name="TrendingUp" className="text-primary" size={28} />
                  Ваш прогресс
                </span>
                <Badge variant="secondary" className="text-lg px-4 py-2 animate-pulse-glow">
                  Уровень {level}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-bold text-primary">{totalPoints}</p>
                  <p className="text-muted-foreground">Всего баллов</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-secondary">{Math.round(progressToNextLevel)}%</p>
                  <p className="text-muted-foreground">До следующего уровня</p>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={progressToNextLevel} className="h-4" />
                <p className="text-sm text-muted-foreground text-center">
                  Еще {Math.round((100 - progressToNextLevel) * 20)} баллов до уровня {level + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover:shadow-xl transition-all duration-300 border-2" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Award" className="text-accent" size={24} />
                Достижения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-primary/10 to-secondary/10 hover:scale-105 cursor-pointer'
                        : 'bg-muted/50 opacity-50'
                    }`}
                  >
                    <Icon
                      name={achievement.icon as any}
                      size={32}
                      className={achievement.unlocked ? 'text-primary mx-auto mb-2' : 'text-muted-foreground mx-auto mb-2'}
                    />
                    <p className={`text-sm font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {achievement.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Target" className="text-primary" size={28} />
            Категории активностей
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Dialog key={category.id} onOpenChange={(open) => !open && setSelectedCategory(null)}>
                <DialogTrigger asChild>
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in border-2 hover:border-primary"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${category.color} text-white`}>
                          <Icon name={category.icon as any} size={24} />
                        </div>
                        <Badge variant="outline" className="font-bold text-base">
                          {category.totalPoints}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm leading-tight">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-2">
                        {category.activities.length} {category.activities.length === 1 ? 'активность' : 'активностей'}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>
                        <Icon name={category.icon as any} size={24} />
                      </div>
                      {category.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Всего баллов</p>
                      <p className="text-3xl font-bold text-primary">{category.totalPoints}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Добавить новую активность</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="title">Название</Label>
                          <Input
                            id="title"
                            placeholder="Например: Провел открытый урок"
                            value={newActivityTitle}
                            onChange={(e) => setNewActivityTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="points">Баллы</Label>
                          <Input
                            id="points"
                            type="number"
                            placeholder="Количество баллов"
                            value={newActivityPoints}
                            onChange={(e) => setNewActivityPoints(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Описание (необязательно)</Label>
                          <Textarea
                            id="description"
                            placeholder="Дополнительная информация"
                            value={newActivityDescription}
                            onChange={(e) => setNewActivityDescription(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleAddActivity} className="w-full">
                          <Icon name="Plus" size={20} className="mr-2" />
                          Добавить активность
                        </Button>
                      </div>
                    </div>

                    {category.activities.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">История активностей</h4>
                        <div className="space-y-2">
                          {category.activities.map((activity) => (
                            <div key={activity.id} className="p-3 bg-muted/30 rounded-lg space-y-1">
                              <div className="flex items-start justify-between">
                                <p className="font-medium">{activity.title}</p>
                                <Badge className={category.color}>+{activity.points}</Badge>
                              </div>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                              )}
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
