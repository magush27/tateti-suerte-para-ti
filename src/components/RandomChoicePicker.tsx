import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Shuffle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const RandomChoicePicker = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const addOption = () => {
    if (inputValue.trim() && !options.includes(inputValue.trim())) {
      setOptions([...options, inputValue.trim()]);
      setInputValue("");
      toast({
        title: "Option added!",
        description: `"${inputValue.trim()}" has been added to your choices.`,
      });
    } else if (options.includes(inputValue.trim())) {
      toast({
        title: "Duplicate option",
        description: "This option already exists!",
        variant: "destructive",
      });
    }
  };

  const removeOption = (index: number) => {
    const removedOption = options[index];
    setOptions(options.filter((_, i) => i !== index));
    toast({
      title: "Option removed",
      description: `"${removedOption}" has been removed.`,
    });
  };

  const pickRandom = async () => {
    if (options.length === 0) {
      toast({
        title: "No options available",
        description: "Please add some options first!",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setSelectedOption(null);

    // Create suspense with multiple random selections
    const spinDuration = 2000;
    const intervalTime = 100;
    const totalSpins = spinDuration / intervalTime;
    let currentSpin = 0;

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setSelectedOption(options[randomIndex]);
      currentSpin++;

      if (currentSpin >= totalSpins) {
        clearInterval(spinInterval);
        // Final selection
        const finalIndex = Math.floor(Math.random() * options.length);
        setSelectedOption(options[finalIndex]);
        setIsSpinning(false);
        
        toast({
          title: "Choice selected! 🎉",
          description: `The winner is: "${options[finalIndex]}"`,
        });
      }
    }, intervalTime);
  };

  const clearAll = () => {
    setOptions([]);
    setSelectedOption(null);
    setInputValue("");
    toast({
      title: "All cleared!",
      description: "Ready for new options.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addOption();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
            🎲 Random Choice Picker
          </h1>
          <p className="text-xl text-primary-foreground/90 drop-shadow">
            Add your options and let fate decide!
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8 bg-card/95 backdrop-blur-sm shadow-card border-0">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter an option..."
              className="flex-1 text-lg py-6 rounded-xl border-2 border-muted focus:border-primary transition-colors"
            />
            <Button
              onClick={addOption}
              disabled={!inputValue.trim()}
              className="px-8 py-6 text-lg rounded-xl bg-gradient-primary hover:shadow-playful transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Options List */}
          <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-card border-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Your Options</h2>
              {options.length > 0 && (
                <Button
                  onClick={clearAll}
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {options.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shuffle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No options yet!</p>
                <p className="text-sm">Add some choices above to get started.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedOption === option
                        ? "border-primary bg-primary/10 shadow-glow animate-bounce-in"
                        : "border-muted bg-muted/30 hover:border-primary/50"
                    }`}
                  >
                    <span className="text-lg font-medium text-foreground">{option}</span>
                    <Button
                      onClick={() => removeOption(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Selection Area */}
          <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-card border-0">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Random Selection
            </h2>
            
            <div className="text-center space-y-6">
              {/* Pick Button */}
              <Button
                onClick={pickRandom}
                disabled={options.length === 0 || isSpinning}
                className={`w-full py-8 text-xl font-bold rounded-2xl transition-all duration-500 transform ${
                  isSpinning
                    ? "bg-gradient-rainbow animate-pulse-glow cursor-not-allowed"
                    : "bg-gradient-primary hover:shadow-playful hover:scale-105"
                }`}
              >
                {isSpinning ? (
                  <>
                    <Shuffle className="w-6 h-6 mr-3 animate-spin-slow" />
                    Choosing...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-6 h-6 mr-3" />
                    Pick Random Choice!
                  </>
                )}
              </Button>

              {/* Result Display */}
              <div className="min-h-[120px] flex items-center justify-center">
                {selectedOption ? (
                  <div
                    className={`p-6 rounded-2xl bg-gradient-primary text-primary-foreground shadow-playful ${
                      !isSpinning ? "animate-bounce-in" : ""
                    }`}
                  >
                    <div className="text-sm font-medium mb-2 opacity-90">
                      🎉 Winner:
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedOption}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-lg">Your choice will appear here!</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="text-center text-sm text-muted-foreground">
                {options.length > 0 && (
                  <p>
                    {options.length} option{options.length !== 1 ? "s" : ""} available
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};