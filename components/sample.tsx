"use client";

/**
 * ============================================================================
 * PHO RESTAURANT DAPP INTEGRATION COMPONENT
 * ============================================================================
 *
 * This component allows users to cook authentic pho and try to create
 * the perfect Northern Pho recipe to earn a special flag!
 *
 * All the contract logic is in hooks/useContract.ts
 *
 * ============================================================================
 */

import { useCurrentAccount } from "@iota/dapp-kit";
import { useContract } from "@/hooks/useContract";
import { Button, Container, Heading, Text, TextField } from "@radix-ui/themes";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";

const SampleIntegration = () => {
  const currentAccount = useCurrentAccount();
  const { data, actions, state, phoBoxId, flagId } = useContract();

  const [ingredients, setIngredients] = useState({
    brothQuality: "10",
    noodleThickness: "2",
    beefBrisket: "70",
    basil: "30",
    cilantro: "25",
    mint: "15",
    starAnise: "2",
    cinnamon: "1",
  });

  const isConnected = !!currentAccount;

  // Perfect recipe validation
  const PERFECT_RECIPE = {
    brothQuality: 10,
    noodleThickness: 2,
    beefBrisket: 70,
    basil: 30,
    cilantro: 25,
    mint: 15,
    starAnise: 2,
    cinnamon: 1,
  };

  const isPerfectRecipe = () => {
    return (
      parseInt(ingredients.brothQuality) === PERFECT_RECIPE.brothQuality &&
      parseInt(ingredients.noodleThickness) === PERFECT_RECIPE.noodleThickness &&
      parseInt(ingredients.beefBrisket) === PERFECT_RECIPE.beefBrisket &&
      parseInt(ingredients.basil) === PERFECT_RECIPE.basil &&
      parseInt(ingredients.cilantro) === PERFECT_RECIPE.cilantro &&
      parseInt(ingredients.mint) === PERFECT_RECIPE.mint &&
      parseInt(ingredients.starAnise) === PERFECT_RECIPE.starAnise &&
      parseInt(ingredients.cinnamon) === PERFECT_RECIPE.cinnamon
    );
  };

  const handleIngredientChange = (field: string, value: string) => {
    setIngredients((prev) => ({ ...prev, [field]: value }));
  };

  if (!isConnected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }}>
            🍲 Pho Restaurant dApp
          </Heading>
          <Text>Please connect your wallet to cook authentic pho!</Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1rem",
        background: "var(--gray-a2)",
      }}
    >
      <Container style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Heading size="6" style={{ marginBottom: "2rem" }}>
          🍲 Pho Restaurant dApp
        </Heading>

        {/* Flag Status */}
        {flagId && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "1.5rem",
              background: "var(--green-a3)",
              borderRadius: "8px",
              border: "2px solid var(--green-7)",
            }}
          >
            <Heading size="4" style={{ marginBottom: "0.5rem" }}>
              🎉 Congratulations! Perfect Pho Achieved!
            </Heading>
            <Text
              style={{
                color: "var(--green-11)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              You&apos;ve mastered the perfect Northern Pho recipe and earned your flag!
            </Text>
            <Text
              size="1"
              style={{
                color: "var(--gray-a11)",
                display: "block",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              Flag ID: {flagId}
            </Text>
          </div>
        )}

        {/* Pho Box Status */}
        {phoBoxId && data && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              background: "var(--gray-a3)",
              borderRadius: "8px",
            }}
          >
            <Text
              size="2"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Your Pho Bowl 🍲
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Text size="2">Broth Quality: {data.brothQuality}</Text>
              <Text size="2">Noodle Thickness: {data.noodleThickness}</Text>
              <Text size="2">Beef Brisket: {data.beefBrisket}</Text>
              <Text size="2">Basil: {data.basil}</Text>
              <Text size="2">Cilantro: {data.cilantro}</Text>
              <Text size="2">Mint: {data.mint}</Text>
              <Text size="2">Star Anise: {data.starAnise}</Text>
              <Text size="2">Cinnamon: {data.cinnamon}</Text>
            </div>
            <Text
              size="1"
              style={{
                color: "var(--gray-a11)",
                display: "block",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              Pho Box ID: {phoBoxId}
            </Text>

            {!flagId && (
              <Button
                size="2"
                style={{ marginTop: "1rem" }}
                onClick={actions.getPerfectPhoFlag}
                disabled={state.isLoading || state.isPending}
              >
                {state.isLoading || state.isPending ? (
                  <>
                    <ClipLoader size={14} style={{ marginRight: "8px" }} />
                    Checking...
                  </>
                ) : (
                  "🚩 Claim Perfect Pho Flag"
                )}
              </Button>
            )}
          </div>
        )}

        {/* Cook Pho Form */}
        <div
          style={{
            padding: "1.5rem",
            background: "var(--gray-a3)",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <Heading size="4" style={{ marginBottom: "1rem" }}>
            Cook Authentic Pho 👨‍🍳
          </Heading>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Broth Quality
              </Text>
              <TextField.Root
                value={ingredients.brothQuality}
                onChange={(e) =>
                  handleIngredientChange("brothQuality", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Noodle Thickness
              </Text>
              <TextField.Root
                value={ingredients.noodleThickness}
                onChange={(e) =>
                  handleIngredientChange("noodleThickness", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Beef Brisket
              </Text>
              <TextField.Root
                value={ingredients.beefBrisket}
                onChange={(e) =>
                  handleIngredientChange("beefBrisket", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Basil
              </Text>
              <TextField.Root
                value={ingredients.basil}
                onChange={(e) =>
                  handleIngredientChange("basil", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Cilantro
              </Text>
              <TextField.Root
                value={ingredients.cilantro}
                onChange={(e) =>
                  handleIngredientChange("cilantro", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Mint
              </Text>
              <TextField.Root
                value={ingredients.mint}
                onChange={(e) => handleIngredientChange("mint", e.target.value)}
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Star Anise
              </Text>
              <TextField.Root
                value={ingredients.starAnise}
                onChange={(e) =>
                  handleIngredientChange("starAnise", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
            <div>
              <Text
                size="2"
                style={{ display: "block", marginBottom: "0.3rem" }}
              >
                Cinnamon
              </Text>
              <TextField.Root
                value={ingredients.cinnamon}
                onChange={(e) =>
                  handleIngredientChange("cinnamon", e.target.value)
                }
                type="number"
                min="0"
                max="65535"
              />
            </div>
          </div>

          <Button
            size="3"
            onClick={() =>
              actions.cookPho(
                parseInt(ingredients.brothQuality),
                parseInt(ingredients.noodleThickness),
                parseInt(ingredients.beefBrisket),
                parseInt(ingredients.basil),
                parseInt(ingredients.cilantro),
                parseInt(ingredients.mint),
                parseInt(ingredients.starAnise),
                parseInt(ingredients.cinnamon)
              )
            }
            disabled={state.isPending || state.isLoading}
          >
            {state.isLoading ? (
              <>
                <ClipLoader size={16} style={{ marginRight: "8px" }} />
                Cooking...
              </>
            ) : (
              "🍲 Cook Pho"
            )}
          </Button>
        </div>

        {/* Transaction Status */}
        {state.hash && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--gray-a3)",
              borderRadius: "8px",
            }}
          >
            <Text size="1" style={{ display: "block", marginBottom: "0.5rem" }}>
              Transaction Hash
            </Text>
            <Text
              size="2"
              style={{ fontFamily: "monospace", wordBreak: "break-all" }}
            >
              {state.hash}
            </Text>
            {state.isConfirmed && (
              <Text
                size="2"
                style={{
                  color: "green",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                ✅ Transaction confirmed!
              </Text>
            )}
          </div>
        )}

        {/* Error Display */}
        {state.error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1.5rem",
              background: "var(--red-a3)",
              borderRadius: "8px",
              border: "1px solid var(--red-7)",
            }}
          >
            <Text
              size="3"
              weight="bold"
              style={{
                color: "var(--red-11)",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              {(state.error as Error)?.message?.includes("❌")
                ? (state.error as Error)?.message
                : `❌ Error: ${(state.error as Error)?.message || String(state.error)}`}
            </Text>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SampleIntegration;
